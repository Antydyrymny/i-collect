import { useCallback, useMemo } from 'react';
import { Button, Card, CloseButton, Col, Form, Row, Spinner } from 'react-bootstrap';
import { collectionThemes, fieldTypes } from '../../data';
import {
    ClientRoutes,
    CollectionResponse,
    EditedFormatField,
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
import {
    useCollectionMainFields,
    useCollectionOptionalFields,
    useEditing,
    useInformOfError,
} from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUpdatedFields } from '../../utils/getUpdatedFields';
import { useLocale } from '../../contexts/locale';
import { nanoid } from '@reduxjs/toolkit';
import { getUpdatedOptionalFields } from '../../utils';

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
    const defaultOptionalFieldsState = useMemo<EditedFormatField[]>(
        () => collection.format.map((field) => ({ id: nanoid(), new: false, ...field })),
        [collection.format]
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
    } = useCollectionMainFields(defaultState, defaultImgState);

    const {
        optionalFields,
        addOptionalField,
        deleteOptionalField,
        changeOptionalFields,
        resetOptionalFields,
    } = useCollectionOptionalFields(defaultOptionalFieldsState);

    const resetCollectionState = useCallback(() => {
        resetMainState();
        resetOptionalFields();
    }, [resetMainState, resetOptionalFields]);

    const { editing, onChange, stopEditing } = useEditing(
        allowEdit,
        resetCollectionState
    );

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
        const optionalFieldsUpdate = getUpdatedOptionalFields(
            defaultOptionalFieldsState,
            optionalFields
        );
        const updateFormat = optionalFieldsUpdate.length
            ? { format: JSON.stringify(optionalFieldsUpdate) }
            : false;

        let finalUpdate = { _id: collection._id };
        if (mainFieldsUpdate) finalUpdate = { ...finalUpdate, ...mainFieldsUpdate };
        if (imgUpdate) finalUpdate = { ...finalUpdate, ...imgUpdate };
        if (deleteImg) finalUpdate = { ...finalUpdate, ...deleteImg };
        if (updateFormat) finalUpdate = { ...finalUpdate, ...updateFormat };

        if (mainFieldsUpdate || imgUpdate || deleteImg || updateFormat)
            updateCollection(finalUpdate);
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
    const tNCol = useLocale('newCollection');

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
                                        <Form.Label className='text-center text-secondary-emphasis'>
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
                                <Col className='pb-2'>
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
                {(!!optionalFields.length || editing) && (
                    <Card className='mt-4'>
                        <Card.Body>
                            <h6 className='mt-2 mb-4'>{t('additionalFields')}</h6>
                            {optionalFields.map((field) => (
                                <div
                                    key={field.id}
                                    className='d-block d-lg-flex align-items-center mb-3'
                                >
                                    <Row className='w-lg-50 w-100'>
                                        <Col xs={12}>
                                            <GenericInputField
                                                editing={editing}
                                                type={'string'}
                                                value={field.fieldName}
                                                onChange={changeOptionalFields(
                                                    field.id,
                                                    'name'
                                                )}
                                                label={t('fieldName')}
                                                placeholder={t('fieldNamePlaceholder')}
                                                sm
                                            />
                                        </Col>
                                    </Row>
                                    <Row className='w-lg-50 w-100 position-relative'>
                                        {!field.new && (
                                            <Col xs={12} sm={12} className='ms-lg-5'>
                                                <GenericInputField
                                                    type={'string'}
                                                    value={field.fieldType}
                                                    onChange={changeOptionalFields(
                                                        field.id,
                                                        'name'
                                                    )}
                                                    editing={false}
                                                    label={t('fieldType')}
                                                    sm
                                                />
                                            </Col>
                                        )}
                                        {field.new && (
                                            <Col
                                                xs={12}
                                                sm={12}
                                                lg={11}
                                                className='ms-lg-5 mt-2 mt-lg-0'
                                            >
                                                <GenericInputField
                                                    type={'select'}
                                                    value={field.fieldType}
                                                    onChange={changeOptionalFields(
                                                        field.id,
                                                        'type'
                                                    )}
                                                    editing={editing}
                                                    options={fieldTypes.map((type) =>
                                                        tDict(type)
                                                    )}
                                                    label={t('fieldType')}
                                                    inlineProportions={[3, 8]}
                                                    sm
                                                />
                                            </Col>
                                        )}
                                        {editing && (
                                            <Col
                                                xs={1}
                                                className='position-absolute end-0 mt-2 me-1 d-flex align-items-center'
                                            >
                                                <CloseButton
                                                    onClick={deleteOptionalField(
                                                        field.id
                                                    )}
                                                    className='d-block d-lg-none mx-0 my-0'
                                                />
                                            </Col>
                                        )}
                                    </Row>
                                    {editing && (
                                        <CloseButton
                                            onClick={deleteOptionalField(field.id)}
                                            className='d-none p-absolute z-3 d-lg-block mt-1 me-3'
                                        />
                                    )}
                                    <hr className='d-block d-lg-none me-4' />
                                </div>
                            ))}
                            {editing && (
                                <Button onClick={addOptionalField} className='mt-3 mb-2'>
                                    {tNCol('addField')}
                                </Button>
                            )}
                        </Card.Body>
                    </Card>
                )}
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
