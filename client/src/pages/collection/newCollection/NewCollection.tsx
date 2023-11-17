import { useCallback, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useNewCollectionMutation } from '../../../app/services/api';
import { useSelectUser } from '../../../app/services/features/auth';
import { useLocale } from '../../../contexts/locale';
import { useCollectionHandlers } from '../../../hooks';
import { Button, Form, Spinner } from 'react-bootstrap';
import { CardWrapper } from '../../../components';
import RequiredFields from './RequiredFields';
import OptionalFields from './OptionalFields';
import { toast } from 'react-toastify';
import {
    ClientRoutes,
    FormatField,
    NewCollectionReq,
    isStringError,
} from '../../../types';

function NewCollection() {
    const user = useSelectUser();
    const { userId } = useParams();
    const ownerId = user.admin ? userId : undefined;

    const defaultState = useMemo<
        Pick<NewCollectionReq, 'name' | 'description' | 'theme'>
    >(
        () => ({
            name: '',
            description: '',
            theme: 'Other',
        }),
        []
    );
    const defaultImgState = useMemo(
        () => ({
            file: null,
            imgPreview: undefined,
        }),
        []
    );
    const {
        mainFields,
        handleMainStateChange,
        imageData,
        handleImageChange,
        clearImage,
    } = useCollectionHandlers(defaultState, defaultImgState);

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

    const [createCollection, collectionOptions] = useNewCollectionMutation();
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (collectionOptions.isLoading) return;
        try {
            const collectionRes = await createCollection({
                ownerId,
                name: mainFields.name,
                description: mainFields.description,
                theme: mainFields.theme,
                format: optionalFields,
            }).unwrap();
            navigate(ClientRoutes.CollectionPath + collectionRes._id);
        } catch (error) {
            toast.error(isStringError(error) ? error.data : 'Error connecting to server');
        }
    };

    const t = useLocale('newCollection');

    return (
        <CardWrapper>
            <h2 className='mt-2 mb-4'>{t('title')}</h2>
            <Form onSubmit={handleSubmit}>
                <RequiredFields
                    requiredFields={mainFields}
                    changeRequiredState={handleMainStateChange}
                    imgPreview={imageData.imgPreview}
                    imgName={imageData.file?.name}
                    handleImageChange={handleImageChange}
                    clearImage={clearImage}
                />
                <OptionalFields
                    optionalFields={optionalFields}
                    addOptionalField={addOptionalField}
                    deleteOptionalField={deleteOptionalField}
                    changeOptionalFields={changeOptionalFields}
                />
                <div className='d-flex gap-2 mt-4 mb-2 justify-content-end'>
                    <Button type='submit' disabled={collectionOptions.isLoading}>
                        {collectionOptions.isLoading && (
                            <Spinner size='sm' className='me-2' />
                        )}
                        {t('submit')}
                    </Button>
                    <Link to={ClientRoutes.UserPagePath + userId}>
                        <Button variant='outline-primary'>{t('back')}</Button>
                    </Link>
                </div>
            </Form>
        </CardWrapper>
    );
}

export default NewCollection;
