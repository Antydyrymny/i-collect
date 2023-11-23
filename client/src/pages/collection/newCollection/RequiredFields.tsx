import { collectionThemes } from '../../../data';
import { useLocale } from '../../../contexts/locale';
import { Card, Form } from 'react-bootstrap';
import { NewCollectionReq } from '../../../types';
import { CollectionImg } from '../../../components';
import RichTextInput from '../../../components/inputFields/richText/RichTextInput';

type RequiredFieldsProps = {
    requiredFields: Pick<NewCollectionReq, 'name' | 'description' | 'theme'>;
    changeRequiredState: <T extends 'name' | 'description' | 'theme'>(
        param: T
    ) => (
        e: T extends 'theme'
            ? React.ChangeEvent<HTMLSelectElement>
            : React.ChangeEvent<HTMLInputElement>
    ) => void;
    changeDescription: (arg: string) => void;
    imgPreview: string | undefined;
    imgName: string | undefined;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    clearImage: () => void;
};

function RequiredFields({
    requiredFields,
    changeRequiredState,
    changeDescription,
    imgPreview,
    imgName,
    handleImageChange,
    clearImage,
}: RequiredFieldsProps) {
    const t = useLocale('newCollection');
    const tDict = useLocale('dictionary');

    return (
        <Card>
            <Card.Body>
                <h6 className='mt-2 mb-4'>{t('mainFields')}</h6>
                <div className='d-lg-flex gap-5'>
                    <div className='w-100'>
                        <Form.Group controlId='name'>
                            <Form.Label className='text-center'>
                                {t('nameLabel')}
                            </Form.Label>
                            <Form.Control
                                type='text'
                                value={requiredFields.name}
                                onChange={changeRequiredState('name')}
                                placeholder={t('namePlaceholder')}
                                required
                                maxLength={255}
                            />
                        </Form.Group>
                        <Form.Group className='mt-3' controlId='description'>
                            <Form.Label className='text-center'>
                                {t('descriptionLabel')}
                            </Form.Label>
                            <RichTextInput
                                initialContent=''
                                editedContent={requiredFields.description}
                                setEditedContent={changeDescription}
                                editing
                                placeholder={t('descriptionPlaceholder')}
                                required
                            />
                        </Form.Group>
                        <Form.Group className='mt-3 mb-2' controlId='collectionTheme'>
                            <Form.Label className='text-center'>
                                {t('themeLabel')}
                            </Form.Label>
                            <Form.Select
                                value={requiredFields.theme}
                                onChange={changeRequiredState('theme')}
                                required
                            >
                                {collectionThemes.map((theme) => (
                                    <option key={theme} value={theme}>
                                        {tDict(theme)}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <CollectionImg
                        imgPreview={imgPreview}
                        imgName={imgName}
                        handleImageChange={handleImageChange}
                        clearImage={clearImage}
                    />
                </div>
            </Card.Body>
        </Card>
    );
}

export default RequiredFields;
