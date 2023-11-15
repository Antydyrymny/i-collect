import { useMemo, useState } from 'react';
import { Button, Card, Form, Image, Spinner } from 'react-bootstrap';
import { useThemeContext } from '../../contexts/theme';
import edit from '../../assets/edit.png';
import editDark from '../../assets/edit-dark.png';
import { collectionThemes } from '../../data';
import {
    ClientRoutes,
    CollectionResponse,
    ItemCollection,
    UpdateCollectionReq,
    isStringError,
} from '../../types';
import { CollectionImg, DeleteButton, EditInputField } from '../../components';
import {
    useDeleteCollectionMutation,
    useUpdateCollectionMutation,
} from '../../app/services/api';
import { useCollectionMainFields, useInformOfError } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const fieldsToUpdate = ['name', 'description', 'theme', 'image'] as const;

type CollectionProps = {
    collection: CollectionResponse;
    allowEdit: boolean;
};

function Collection({ collection, allowEdit }: CollectionProps) {
    const [editing, setEditing] = useState(false);

    const defaultState = useMemo<Pick<ItemCollection, 'name' | 'description' | 'theme'>>(
        () => ({
            name: collection.name,
            description: collection.description,
            theme: collection.theme,
        }),
        [collection.description, collection.name, collection.theme]
    );
    const defaultImgState = useMemo(
        () => ({
            file: null,
            imgPreview: collection.image,
        }),
        [collection.image]
    );
    const {
        mainFields: editState,
        resetMainState,
        handleMainStateChange: handleEditMainFields,
        imageData,
        handleImageChange: handleEditImage,
        clearImage,
    } = useCollectionMainFields(defaultState, defaultImgState);

    const startEditing = () => {
        if (!allowEdit) return;
        setEditing(true);
    };
    const cancelEdit = () => {
        setEditing(false);
        resetMainState;
    };

    const [updateCollection, updateOptions] = useUpdateCollectionMutation();
    const [deleteCollection, deleteOptions] = useDeleteCollectionMutation();
    useInformOfError([
        { isError: updateOptions.isError, error: updateOptions.error },
        { isError: deleteOptions.isError, error: deleteOptions.error },
    ]);

    const navigate = useNavigate();
    const handleSubmitUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (updateOptions.isLoading || deleteOptions.isLoading) return;
        const updateReq: UpdateCollectionReq = {
            _id: collection._id,
        };
        let changesPresent = false;
        fieldsToUpdate.forEach((field) => {
            if (field === 'image' && imageData.file) {
                // updateReq.image = imageData.file;
                // changesPresent = true;
            } else if (field !== 'image' && editState[field] !== collection[field]) {
                updateReq[field] = editState[field];
                changesPresent = true;
            }
        });

        if (changesPresent) updateCollection(updateReq);
        setEditing(false);
    };
    const handleDelete = async () => {
        if (deleteOptions.isLoading) return;
        try {
            await deleteCollection(collection._id);
            navigate(ClientRoutes.Home);
        } catch (error) {
            toast.error(isStringError(error) ? error.data : 'Error connecting to server');
        }
    };

    const { theme } = useThemeContext();

    return (
        <Card style={{ borderRadius: '0.5rem' }}>
            <Card.Body
                className='p-3 bg-body-tertiary'
                style={{ borderRadius: '0.5rem' }}
            >
                <Form onSubmit={handleSubmitUpdate}>
                    <header className='d-flex justify-content-between align-items-start mt-2 mb-4'>
                        <div className='w-50'>
                            <EditInputField
                                type={'string'}
                                originalValue={collection.name}
                                editedValue={editState.name}
                                editing={editing}
                                onEdit={handleEditMainFields('name')}
                                asHeading
                            />
                            <h6
                                style={{
                                    position: 'relative',
                                    top: editing ? '0.5rem' : undefined,
                                }}
                            >
                                by {collection.authorName}
                            </h6>
                        </div>
                        {allowEdit && (
                            <div className='d-flex gap-2'>
                                <Button onClick={editing ? cancelEdit : startEditing}>
                                    <Image
                                        src={theme === 'light' ? edit : editDark}
                                        className='me-2'
                                    />
                                    {editing ? 'Cancel edit' : 'Edit collection'}
                                </Button>
                                <DeleteButton
                                    handleDelete={handleDelete}
                                    disabled={deleteOptions.isLoading}
                                    isLoading={deleteOptions.isLoading}
                                    tooltipMsg='Delete collection'
                                />
                            </div>
                        )}
                    </header>
                    <Card>
                        <Card.Body>
                            <h6 className='mt-2 mb-4'>Info</h6>
                            <div className='d-lg-flex gap-5 mb-2'>
                                <div className='w-100'>
                                    <EditInputField
                                        type={'select'}
                                        originalValue={collection.theme}
                                        editedValue={editState.theme}
                                        editing={editing}
                                        onEdit={handleEditMainFields('theme')}
                                        options={collectionThemes}
                                        label='Theme'
                                    />
                                    <EditInputField
                                        type={'text'}
                                        originalValue={collection.description}
                                        editedValue={editState.description}
                                        editing={editing}
                                        onEdit={handleEditMainFields('description')}
                                        label='Description'
                                    />
                                </div>
                                {(collection.image || allowEdit) && (
                                    <CollectionImg
                                        imgPreview={imageData.imgPreview}
                                        imgName={imageData.file?.name}
                                        handleImageChange={handleEditImage}
                                        clearImage={clearImage}
                                        hideImgLabel
                                    />
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                    {allowEdit && (
                        <div className='d-flex mt-4 mb-2 justify-content-end'>
                            <Button
                                type='submit'
                                disabled={!editing || updateOptions.isLoading}
                            >
                                {updateOptions.isLoading && (
                                    <Spinner size='sm' className='me-2' />
                                )}
                                Save changes
                            </Button>
                        </div>
                    )}
                </Form>
            </Card.Body>
        </Card>
    );
}

export default Collection;
