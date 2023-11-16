import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useLocale } from '../../../contexts/locale';
import { useTagsHandlers } from '../../../hooks';
import { useNewItemMutation } from '../../../app/services/api';
import { useCollection } from '../../layouts/collectionLayout/useCollection';
import { toast } from 'react-toastify';
import { Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { CardWrapper, GenericInputField } from '../../../components';
import { ClientRoutes, ItemReqFormatField, isStringError } from '../../../types';
import Tags from './Tags';

function NewItem() {
    const collection = useCollection();

    const [name, setName] = useState('');
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const { tags, addTag, removeTag, submitCurTag } = useTagsHandlers();

    const [fields, setFields] = useState<ItemReqFormatField[]>(() =>
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
        }))
    );
    const handleFieldChange =
        (ind: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setFields((prevFields) =>
                prevFields.map((field, fieldInd) =>
                    fieldInd === ind
                        ? {
                              ...field,
                              fieldValue:
                                  field.fieldType === 'boolean'
                                      ? e.target.checked
                                      : e.target.value,
                          }
                        : { ...field }
                )
            );
        };

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
            <h2 className='mt-2 mb-2'>{t('newItem')}</h2>
            <h6 className='mb-3'>
                {t('ofCollection')}
                <b>
                    <Link to={ClientRoutes.CollectionPath + collection._id}>
                        {collection.name}
                    </Link>
                </b>
            </h6>
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
                            {collection.format.map((field, ind) => (
                                <Col key={ind} xs={12} lg={6}>
                                    <GenericInputField
                                        type={field.fieldType}
                                        value={fields[ind].fieldValue}
                                        onChange={handleFieldChange(ind)}
                                        label={field.fieldName}
                                        placeholder={
                                            t('genericPlaceholder') + field.fieldName
                                        }
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
