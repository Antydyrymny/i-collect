import { useRef } from 'react';
import { collectionThemes } from '../../../data';
import { useThemeContext } from '../../../contexts/theme';
import TooltipOverlay from '../../../components/tooltip/TooltipOverlay';
import { Button, Card, CloseButton, Container, Form, Image } from 'react-bootstrap';
import upload from '../../../assets/upload.png';
import uploadDark from '../../../assets/upload-dark.png';
import { NewCollectionReq } from '../../../types';

type RequiredFieldsProps = {
    requiredFields: Pick<NewCollectionReq, 'name' | 'description' | 'theme'>;
    changeRequiredState: <T extends 'name' | 'description' | 'theme'>(
        param: T
    ) => (
        e: T extends 'theme'
            ? React.ChangeEvent<HTMLSelectElement>
            : React.ChangeEvent<HTMLInputElement>
    ) => void;
    imgPreview: string | null;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    clearImage: () => void;
};

function RequiredFields({
    requiredFields,
    changeRequiredState,
    imgPreview,
    handleImageChange,
    clearImage,
}: RequiredFieldsProps) {
    const { theme } = useThemeContext();

    const imageInputRef = useRef<HTMLInputElement>(null);
    const startUpload = () => {
        imageInputRef.current?.click();
    };

    const handleClearImage = () => {
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
            clearImage();
        }
    };

    return (
        <Card>
            <Card.Body>
                <h6 className='mt-2 mb-4'>Main fields</h6>
                <div className='d-lg-flex gap-5'>
                    <div className='w-100'>
                        <Form.Group controlId='name'>
                            <Form.Label className='text-center'>{'Name'}</Form.Label>
                            <Form.Control
                                type='text'
                                value={requiredFields.name}
                                onChange={changeRequiredState('name')}
                                placeholder={`Enter collection's name`}
                                required
                            />
                        </Form.Group>
                        <Form.Group className='mt-3' controlId='description'>
                            <Form.Label className='text-center'>
                                {'Description'}
                            </Form.Label>
                            <Form.Control
                                as='textarea'
                                rows={3}
                                value={requiredFields.description}
                                onChange={changeRequiredState('description')}
                                placeholder={`Enter collection's description`}
                                required
                            />
                        </Form.Group>
                        <Form.Group className='mt-3 mb-2' controlId='collectionTheme'>
                            <Form.Label className='text-center'>{'Theme'}</Form.Label>
                            <Form.Select
                                value={requiredFields.theme}
                                onChange={changeRequiredState('theme')}
                                required
                            >
                                {collectionThemes.map((theme) => (
                                    <option key={theme} value={theme}>
                                        {theme}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <Form.Group className='w-100' controlId='image'>
                        <Form.Label className='d-none d-lg-block w-50 ms-lg-4 text-center'>
                            {'Image'}
                        </Form.Label>
                        <Form.Label className='d-lg-none d-block mt-3'>
                            {'Image'}
                        </Form.Label>
                        <Form.Control
                            type='file'
                            accept='image/.jpeg,.jpg,.pdf'
                            onChange={handleImageChange}
                            ref={imageInputRef}
                            className='d-lg-none mb-2'
                        />
                        <Container
                            className='d-none d-lg-flex flex-column gap-2 w-50 position-relative
                        h-75 mt-3 px-0 justify-content-center align-items-center border rounded-3 '
                        >
                            {!imgPreview && (
                                <TooltipOverlay
                                    id='upload'
                                    tooltipMessage={'Upload image'}
                                    placement='top'
                                >
                                    <Button
                                        onClick={startUpload}
                                        variant='outline-primary'
                                        className='rounded-circle d-flex justify-content-center align-items-center'
                                        style={{ width: '3rem', height: '3rem' }}
                                    >
                                        <Image
                                            src={theme === 'light' ? upload : uploadDark}
                                            alt='Upload image'
                                        />
                                    </Button>
                                </TooltipOverlay>
                            )}
                            {imgPreview && (
                                <CloseButton
                                    onClick={handleClearImage}
                                    className='position-absolute top-0 end-0 mt-2 me-2'
                                />
                            )}
                            {imgPreview ? (
                                <Image
                                    src={imgPreview}
                                    alt='Uploaded image'
                                    className='h-100 w-100 rounded-3'
                                />
                            ) : (
                                <div>Upload image</div>
                            )}
                        </Container>
                    </Form.Group>
                </div>
            </Card.Body>
        </Card>
    );
}

export default RequiredFields;
