import { useMemo, useState } from 'react';
import { Button, Card, Col, Form, Image, Row, Spinner } from 'react-bootstrap';
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
import {
    CardWrapper,
    CollectionImg,
    DeleteButton,
    GenericInputField,
} from '../../components';
import {
    useDeleteCollectionMutation,
    useUpdateCollectionMutation,
} from '../../app/services/api';
import { useCollectionMainFields, useInformOfError } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUpdatedFields } from '../../utils/getUpdatedFields';
import { useLocale } from '../../contexts/locale';

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
        resetMainState();
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

        const mainFieldsUpdate = getUpdatedFields(collection, editState);
        const imgUpdate = imageData.file ? { image: imageData.file } : false;

        let finalUpdate: UpdateCollectionReq = { _id: collection._id };
        if (mainFieldsUpdate) finalUpdate = { ...finalUpdate, ...mainFieldsUpdate };
        // if (imgUpdate) finalUpdate = { ...finalUpdate, ...imgUpdate };

        if (mainFieldsUpdate || imgUpdate) updateCollection(finalUpdate);
        setEditing(false);
    };
    const handleDelete = async () => {
        if (deleteOptions.isLoading) return;
        try {
            await deleteCollection({ collectionToDeleteId: collection._id });
            navigate(ClientRoutes.Home);
        } catch (error) {
            toast.error(isStringError(error) ? error.data : 'Error connecting to server');
        }
    };

    const { theme } = useThemeContext();
    const t = useLocale('collectionPage');
    const tDict = useLocale('dictionary');

    return (
        <CardWrapper>
            <Form onSubmit={handleSubmitUpdate}>
                <header className='d-flex justify-content-between align-items-start mt-2 mb-4 gap-2'>
                    <div className='w-50'>
                        <GenericInputField
                            type={'string'}
                            value={editState.name}
                            onChange={handleEditMainFields('name')}
                            editing={editing}
                            placeholder={t('namePlaceholder')}
                            asHeading
                        />
                        <h6
                            style={{
                                position: 'relative',
                                top: editing ? '0.5rem' : undefined,
                            }}
                        >
                            {t('by')}
                            {collection.authorName}
                        </h6>
                    </div>
                    {allowEdit && (
                        <div className='d-flex gap-2'>
                            <Button
                                onClick={editing ? cancelEdit : startEditing}
                                className='text-nowrap'
                            >
                                <Image
                                    src={theme === 'light' ? edit : editDark}
                                    className='me-2'
                                />
                                {editing ? t('stopEdit') : t('edit')}
                            </Button>
                            <DeleteButton
                                handleDelete={handleDelete}
                                disabled={deleteOptions.isLoading}
                                isLoading={deleteOptions.isLoading}
                                tooltipMsg={t('deleteCollection')}
                            />
                        </div>
                    )}
                </header>
                <Card>
                    <Card.Body>
                        <h6 className='mt-2 mb-4'>{t('info')}</h6>
                        <Row className='d-lg-flex gap-5 mb-2'>
                            <Col lg={6}>
                                <GenericInputField
                                    type={'select'}
                                    value={tDict(editState.theme)}
                                    onChange={handleEditMainFields('theme')}
                                    editing={editing}
                                    options={collectionThemes.map((theme) =>
                                        tDict(theme)
                                    )}
                                    label={t('themeLabel')}
                                />
                                <GenericInputField
                                    type={'text'}
                                    value={editState.description}
                                    onChange={handleEditMainFields('description')}
                                    editing={editing}
                                    label={t('descriptionLabel')}
                                    placeholder={t('descriptionPlaceholder')}
                                />
                            </Col>
                            {(collection.image || allowEdit) && (
                                <Col>
                                    <CollectionImg
                                        imgPreview={imageData.imgPreview}
                                        imgName={imageData.file?.name}
                                        handleImageChange={handleEditImage}
                                        clearImage={clearImage}
                                        hideImgLabel
                                        allowEdit={editing}
                                    />
                                </Col>
                            )}
                        </Row>
                    </Card.Body>
                </Card>
                <Card className='mt-4'>
                    <Card.Body>
                        <h6 className='mt-2 mb-4'>{t('additionalFields')}</h6>
                        {collection.format.map((field, ind) => (
                            <div
                                key={ind}
                                className='d-block d-lg-flex gap-5 mb-3'
                                style={{ paddingTop: '0.4375rem' }}
                            >
                                <Row className='w-lg-50 w-100'>
                                    <Col xs={6} sm={3}>
                                        {t('fieldName')}
                                    </Col>
                                    <Col xs={6} sm={9}>
                                        {field.fieldName}
                                    </Col>
                                </Row>
                                <Row className='w-lg-50 w-100'>
                                    <Col xs={6} sm={3}>
                                        {t('fieldType')}
                                    </Col>
                                    <Col xs={6} sm={9}>
                                        {field.fieldType}
                                    </Col>
                                </Row>
                            </div>
                        ))}
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
                            {t('save')}
                        </Button>
                    </div>
                )}
            </Form>
        </CardWrapper>
    );
}

export default Collection;
