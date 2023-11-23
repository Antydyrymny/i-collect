import { useMemo } from 'react';
import { Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { collectionThemes } from '../../data';
import {
    ClientRoutes,
    CollectionResponse,
    ItemCollection,
    isStringError,
} from '../../types';
import {
    CardWrapper,
    CollectionImg,
    DeleteButton,
    EditButton,
    GenericInputField,
} from '../../components';
import RichTextInput from '../../components/inputFields/richText/RichTextInput';
import {
    useDeleteCollectionMutation,
    useUpdateCollectionMutation,
} from '../../app/services/api';
import { useCollectionHandlers, useEditing, useInformOfError } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUpdatedFields } from '../../utils/getUpdatedFields';
import { useLocale } from '../../contexts/locale';

type CollectionProps = {
    collection: CollectionResponse;
    allowEdit: boolean;
};

function CollectionCard({ collection, allowEdit }: CollectionProps) {
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
        handleDescriptionChange,
        imageData,
        handleImageChange: handleEditImage,
        clearImage,
    } = useCollectionHandlers(defaultState, defaultImgState);

    const { editing, onChange, stopEditing } = useEditing(allowEdit, resetMainState);

    const [updateCollection, updateOptions] = useUpdateCollectionMutation();
    useInformOfError({ isError: updateOptions.isError, error: updateOptions.error });

    const [deleteCollection, deleteOptions] = useDeleteCollectionMutation();

    const navigate = useNavigate();
    const handleSubmitUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editing || updateOptions.isLoading || deleteOptions.isLoading) return;

        const mainFieldsUpdate = getUpdatedFields(collection, editState);
        const imgUpdate = imageData.file ? { image: imageData.file } : false;
        const deleteImg =
            !imageData.file && !imageData.imgPreview && defaultImgState.imgPreview
                ? { deleteImage: true }
                : false;

        let finalUpdate = { _id: collection._id };
        if (mainFieldsUpdate) finalUpdate = { ...finalUpdate, ...mainFieldsUpdate };
        if (imgUpdate) finalUpdate = { ...finalUpdate, ...imgUpdate };
        if (deleteImg) finalUpdate = { ...finalUpdate, ...deleteImg };

        if (mainFieldsUpdate || imgUpdate || deleteImg) updateCollection(finalUpdate);
        stopEditing();
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
                                top: editing ? '0.75rem' : undefined,
                            }}
                            className='mt-2 mb-0'
                        >
                            {t('by')}
                            {collection.authorName}
                        </h6>
                    </div>
                    {allowEdit && (
                        <div className='d-flex gap-2'>
                            <EditButton
                                editing={editing}
                                onChange={onChange}
                                startEditMsg={t('edit')}
                                cancelEditMsg={t('stopEdit')}
                            />
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
                                <Form.Group as={Row}>
                                    <Col sm={3}>
                                        <Form.Label className='text-center'>
                                            {t('descriptionLabel')}
                                        </Form.Label>
                                    </Col>
                                    <Col sm={9}>
                                        <RichTextInput
                                            initialContent={defaultState.description}
                                            editedContent={editState.description}
                                            setEditedContent={handleDescriptionChange}
                                            editing={editing}
                                            placeholder={t('descriptionPlaceholder')}
                                            required
                                            xs
                                        />
                                    </Col>
                                </Form.Group>
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
                                    <Col
                                        xs={6}
                                        sm={3}
                                        className='text-secondary-emphasis'
                                    >
                                        {t('fieldName')}
                                    </Col>
                                    <Col xs={6} sm={9}>
                                        {field.fieldName}
                                    </Col>
                                </Row>
                                <Row className='w-lg-50 w-100'>
                                    <Col
                                        xs={6}
                                        sm={3}
                                        className='text-secondary-emphasis'
                                    >
                                        {t('fieldType')}
                                    </Col>
                                    <Col xs={6} sm={9}>
                                        {tDict(field.fieldType)}
                                    </Col>
                                </Row>
                            </div>
                        ))}
                    </Card.Body>
                </Card>
                {(editing || updateOptions.isLoading) && (
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

export default CollectionCard;
