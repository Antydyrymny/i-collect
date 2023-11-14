import { useCallback, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useNewCollectionMutation } from '../../../app/services/api';
import { useSelectUser } from '../../../app/services/features/auth';
import { Button, Card, Container, Form, Spinner } from 'react-bootstrap';
import {
    ClientRoutes,
    FormatField,
    NewCollectionReq,
    isStringError,
} from '../../../types';
import RequiredFields from './RequiredFields';
import OptionalFields from './OptionalFields';
import { toast } from 'react-toastify';

function NewCollection() {
    const user = useSelectUser();
    const { userId } = useParams();
    const ownerId = user.admin ? userId : undefined;

    const [createCollection, collectionOptions] = useNewCollectionMutation();

    const [requiredFields, setRequiredFields] = useState<
        Pick<NewCollectionReq, 'name' | 'description' | 'theme'>
    >({
        name: '',
        description: '',
        theme: 'Other',
    });
    const changeRequiredState = useCallback(
        <T extends 'name' | 'description' | 'theme'>(param: T) =>
            (
                e: T extends 'theme'
                    ? React.ChangeEvent<HTMLSelectElement>
                    : React.ChangeEvent<HTMLInputElement>
            ) =>
                setRequiredFields((prevState) => ({
                    ...prevState,
                    [param]: e.target.value,
                })),
        []
    );
    const [imageData, setImageData] = useState<{
        file: File | null;
        imgPreview: string | null;
    }>({
        file: null,
        imgPreview: null,
    });
    const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            const file = e.target.files[0];
            reader.onloadend = () => {
                setImageData({ file, imgPreview: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    }, []);
    const clearImage = useCallback(() => {
        setImageData({ file: null, imgPreview: null });
    }, []);

    const [optionalFields, setOptionalFields] = useState<FormatField[]>([]);
    const addOptionalField = useCallback(() => {
        setOptionalFields((fields) => [
            ...fields,
            { fieldName: '', fieldType: 'string' },
        ]);
    }, []);
    const deleteOptionalField = useCallback((ind: number) => {
        setOptionalFields((fields) =>
            fields.filter((_field, fieldInd) => ind !== fieldInd)
        );
    }, []);
    const changeOptionalFields = useCallback(
        <T extends 'name' | 'type'>(ind: number, fieldParam: T) =>
            (
                e: T extends 'name'
                    ? React.ChangeEvent<HTMLInputElement>
                    : React.ChangeEvent<HTMLSelectElement>
            ) => {
                setOptionalFields((fields) =>
                    fields.map((field, fieldInd) =>
                        ind === fieldInd
                            ? {
                                  ...field,
                                  [fieldParam === 'name' ? 'fieldName' : 'fieldType']:
                                      e.target.value,
                              }
                            : field
                    )
                );
            },
        []
    );

    const navigate = useNavigate();
    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (collectionOptions.isLoading) return;
            try {
                const collectionRes = await createCollection({
                    ownerId,
                    name: requiredFields.name,
                    description: requiredFields.description,
                    theme: requiredFields.theme,
                    format: optionalFields,
                }).unwrap();
                navigate(ClientRoutes.CollectionPath + collectionRes._id);
            } catch (error) {
                toast.error(
                    isStringError(error) ? error.data : 'Error connecting to server'
                );
            }
        },
        [
            navigate,
            ownerId,
            createCollection,
            collectionOptions.isLoading,
            optionalFields,
            requiredFields.description,
            requiredFields.name,
            requiredFields.theme,
        ]
    );

    return (
        <Container className='pb-5 '>
            <Card style={{ borderRadius: '0.5rem' }}>
                <Card.Body
                    style={{ borderRadius: '0.5rem' }}
                    className='p-3 bg-body-tertiary'
                >
                    <h3 className='mt-2 mb-4'>Create new collection</h3>
                    <Form onSubmit={handleSubmit}>
                        <RequiredFields
                            requiredFields={requiredFields}
                            changeRequiredState={changeRequiredState}
                            imgPreview={imageData.imgPreview}
                            handleImageChange={handleImageChange}
                            clearImage={clearImage}
                        />
                        <OptionalFields
                            optionalFields={optionalFields}
                            addOptionalField={addOptionalField}
                            deleteOptionalField={deleteOptionalField}
                            changeOptionalFields={changeOptionalFields}
                        />
                        <div className='d-flex gap-3 mt-4 mb-2 justify-content-end'>
                            <Button type='submit' disabled={collectionOptions.isLoading}>
                                {collectionOptions.isLoading && (
                                    <Spinner size='sm' className='me-2' />
                                )}
                                Save collection
                            </Button>
                            <Link to={ClientRoutes.UserPagePath + userId}>
                                <Button variant='outline-primary'>Cancel</Button>
                            </Link>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default NewCollection;
