import { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useLocale } from '../../../contexts/locale';
import { useItemHandlers, useTagHandlers } from '../../../hooks';
import { useNewItemMutation } from '../../../app/services/api';
import { useCollection } from '../../layouts/collectionLayout/useCollection';
import { toast } from 'react-toastify';
import { Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { CardWrapper, GenericInputField } from '../../../components';
import { ClientRoutes, isStringError } from '../../../types';
import Tags from './Tags';

function NewItem() {
    const collection = useCollection();

    const fieldsInitializer = useCallback(
        () =>
            collection.format.map((field) => ({
                ...field,
                fieldValue:
                    field.fieldType === 'boolean'
                        ? true
                        : field.fieldType === 'number'
                        ? 0
                        : field.fieldType === 'date'
                        ? dayjs().format('YYYY-MM-DD')
                        : '',
            })),
        [collection.format]
    );
    const { name, handleNameChange, fields, handleFieldChange } = useItemHandlers(
        '',
        fieldsInitializer
    );
    const { tags, addTag, removeTag, submitCurTag } = useTagHandlers();

    const [createItem, itemOptions] = useNewItemMutation();
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (itemOptions.isLoading) return;
        try {
            const itemRes = await createItem({
                name,
                tags,
                fields,
                parentCollectionId: collection._id,
            }).unwrap();
            navigate(ClientRoutes.ItemPath + itemRes._id);
        } catch (error) {
            toast.error(isStringError(error) ? error.data : 'Error connecting to server');
        }
    };

    const t = useLocale('newItem');

    return (
        <CardWrapper>
            <header className='mb-4'>
                <h2 className='mt-2 mb-2'>{t('newItem')}</h2>
                <h6>
                    {t('ofCollection')}
                    <Link
                        to={ClientRoutes.CollectionPath + collection._id}
                        className='text-decoration-underline text-primary-emphasis'
                    >
                        {collection.name}
                    </Link>
                </h6>
            </header>
            <Card>
                <Card.Body>
                    <h6 className='mt-2 mb-4'>{t('info')}</h6>
                    <Form id='newItem' onSubmit={handleSubmit}>
                        <Row>
                            <Col xs={12} lg={6}>
                                <GenericInputField
                                    type={'string'}
                                    value={name}
                                    onChange={handleNameChange}
                                    label={t('nameLabel')}
                                    placeholder={t('namePlaceholder')}
                                    inlineLabel={false}
                                />
                            </Col>
                            {fields.map(({ fieldType, fieldName, fieldValue }, ind) => (
                                <Col key={ind} xs={12} lg={6}>
                                    <GenericInputField
                                        type={fieldType}
                                        value={fieldValue}
                                        onChange={handleFieldChange(ind)}
                                        label={fieldName}
                                        placeholder={t('genericPlaceholder') + fieldName}
                                        inlineLabel={false}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Form>
                    <Tags
                        tags={tags}
                        addTag={addTag}
                        removeTag={removeTag}
                        submitCurTag={submitCurTag}
                        asHeading
                    />
                </Card.Body>
            </Card>
            <div className='d-flex gap-2 mt-4 mb-2 justify-content-end'>
                <Form>
                    <Button type='submit' form='newItem' disabled={itemOptions.isLoading}>
                        {itemOptions.isLoading && <Spinner size='sm' className='me-2' />}
                        {t('save')}
                    </Button>
                </Form>
                <Link to={ClientRoutes.CollectionPath + collection._id}>
                    <Button variant='outline-primary'>{t('cancel')}</Button>
                </Link>
            </div>
        </CardWrapper>
    );
}

export default NewItem;
