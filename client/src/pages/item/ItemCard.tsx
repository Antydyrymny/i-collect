import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    useEditing,
    useInformOfError,
    useItemHandlers,
    useTagHandlers,
} from '../../hooks';
import {
    useDeleteItemMutation,
    useToggleLikeItemMutation,
    useUpdateItemMutation,
} from '../../app/services/api';
import { ClientRoutes, ItemResponse, isStringError } from '../../types';
import { useSelectUser } from '../../app/services/features/auth';
import { toast } from 'react-toastify';
import Tags from './newItem/Tags';
import {
    CardWrapper,
    DeleteButton,
    EditButton,
    GenericInputField,
    LikeButton,
} from '../../components';
import { Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';

type ItemCardProps = {
    item: ItemResponse;
    allowEdit: boolean;
};

function ItemCard({ item, allowEdit }: ItemCardProps) {
    const defaultFields = useMemo(() => item.fields, [item.fields]);
    const { name, handleNameChange, fields, handleFieldChange, resetState } =
        useItemHandlers(item.name, defaultFields);

    const defaultTags = useMemo(() => item.tags, [item.tags]);
    const { tags, addTag, removeTag, submitCurTag, resetTags } =
        useTagHandlers(defaultTags);

    const { editing, startEditing, stopEditing } = useEditing(allowEdit);
    const cancelEdit = () => {
        stopEditing();
        resetState();
        resetTags();
    };

    const [updateItem, updateOptions] = useUpdateItemMutation();
    const [toogleLike, likeOptions] = useToggleLikeItemMutation();
    useInformOfError([
        { isError: updateOptions.isError, error: updateOptions.error },
        { isError: likeOptions.isError, error: likeOptions.error },
    ]);

    const handleSubmitUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (updateOptions.isLoading || deleteOptions.isLoading) return;

        const updatedFields = fields.filter(
            ({ fieldName, fieldValue }) =>
                defaultFields.find((field) => field.fieldName === fieldName)
                    ?.fieldValue !== fieldValue
        );
        updateItem({
            _id: item._id,
            name: name !== item.name ? name : undefined,
            tags: tags,
            fields: updatedFields.length > 0 ? updatedFields : undefined,
        });
        stopEditing();
    };

    const user = useSelectUser();
    const handleToogleLike = () => {
        if (!user._id) {
            toast.info('Sign in to use likes');
            return;
        }
        if (likeOptions.isLoading || deleteOptions.isLoading) return;
        toogleLike({ _id: item._id, action: item.userLikes ? 'dislike' : 'like' });
    };

    const navigate = useNavigate();
    const [deleteItem, deleteOptions] = useDeleteItemMutation();
    const handleDelete = async () => {
        if (deleteOptions.isLoading) return;
        try {
            await deleteItem({ itemToDeleteId: item._id });
            navigate(ClientRoutes.CollectionPath + item.parentCollection._id);
        } catch (error) {
            toast.error(isStringError(error) ? error.data : 'Error connecting to server');
        }
    };

    return (
        <CardWrapper>
            <header className='d-flex justify-content-between align-items-start mt-2 mb-4 gap-2'>
                <div className='w-50'>
                    <GenericInputField
                        type={'string'}
                        value={name}
                        onChange={handleNameChange}
                        editing={editing}
                        placeholder={`Enter item's name`}
                        asHeading
                    />
                    <h6
                        style={{
                            position: 'relative',
                            top: editing ? '0.75rem' : undefined,
                        }}
                        className='mb-0'
                    >
                        {'from collection: '}
                        <Link
                            to={ClientRoutes.CollectionPath + item.parentCollection._id}
                            className='text-decoration-underline text-primary-emphasis'
                        >
                            {item.parentCollection.name}
                        </Link>
                    </h6>
                </div>
                {allowEdit && (
                    <div className='d-flex gap-2'>
                        <EditButton
                            editing={editing}
                            startEditing={startEditing}
                            startEditMsg={'Edit item'}
                            cancelEdit={cancelEdit}
                            cancelEditMsg={'Cancel edit'}
                        />
                        <DeleteButton
                            handleDelete={handleDelete}
                            disabled={deleteOptions.isLoading}
                            isLoading={deleteOptions.isLoading}
                            tooltipMsg={'Delete item'}
                        />
                    </div>
                )}
            </header>
            <Card>
                <Card.Body>
                    <h6 className='mt-2 mb-4'>{'Item info'}</h6>
                    <Form id='item' onSubmit={handleSubmitUpdate} className='mb-2'>
                        <Row>
                            {fields.map(({ fieldType, fieldName, fieldValue }, ind) => (
                                <Col key={ind} xs={12} lg={6}>
                                    <GenericInputField
                                        editing={editing}
                                        type={fieldType}
                                        value={fieldValue}
                                        onChange={handleFieldChange(ind)}
                                        label={fieldName}
                                        placeholder={'Enter' + fieldName}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Form>
                    <Tags
                        editing={editing}
                        tags={tags}
                        addTag={addTag}
                        removeTag={removeTag}
                        submitCurTag={submitCurTag}
                        asHeading
                    />
                </Card.Body>
            </Card>
            <div className='d-flex gap-2 mt-4 mb-2 justify-content-between'>
                <>
                    <LikeButton
                        liked={item.userLikes}
                        handleLike={handleToogleLike}
                        notAllowed={!user._id}
                        totalLikes={item.likesNumber}
                    />
                    {allowEdit && (
                        <Form>
                            <Button
                                type='submit'
                                form='item'
                                disabled={updateOptions.isLoading}
                            >
                                {updateOptions.isLoading && (
                                    <Spinner size='sm' className='me-2' />
                                )}
                                {'Save'}
                            </Button>
                        </Form>
                    )}
                </>
            </div>
        </CardWrapper>
    );
}

export default ItemCard;
