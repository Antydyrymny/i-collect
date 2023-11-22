import { memo, useRef, useState } from 'react';
import { Button, CloseButton, Container, Form, Image, Spinner } from 'react-bootstrap';
import { TooltipOverlay } from '..';
import { useLocale } from '../../contexts/locale';
import { useThemeContext } from '../../contexts/theme';
import upload from '../../assets/upload.png';
import uploadDark from '../../assets/upload-dark.png';

type CollectionImgProps = {
    imgPreview: string | undefined;
    imgName: string | undefined;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    clearImage: () => void;
    hideImgLabel?: boolean;
    allowEdit?: boolean;
};

const CollectionImg = memo(function CollectionImg({
    imgPreview,
    imgName,
    handleImageChange,
    clearImage,
    hideImgLabel = false,
    allowEdit = true,
}: CollectionImgProps) {
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

    const [isLoading, setIsLoading] = useState(() => (imgPreview ? true : false));
    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const { theme } = useThemeContext();
    const t = useLocale('newCollection');
    return (
        <Form.Group
            className={`${allowEdit ? '' : 'd-none d-lg-block'} w-100`}
            controlId='image'
        >
            {!hideImgLabel && (
                <Form.Label className='d-none d-lg-block w-50 ms-lg-4 text-center'>
                    {t('imageLabel')}
                </Form.Label>
            )}
            <Form.Label className='d-lg-none d-block mt-3'>{t('imageLabel')}</Form.Label>
            <Form.Control
                type='file'
                accept='image/.jpeg,.jpg,.pdf'
                onChange={handleImageChange}
                ref={imageInputRef}
                className='d-lg-none mb-2'
            />
            <Container
                className={`${
                    hideImgLabel ? '' : 'mt-3'
                } d-none d-lg-flex flex-column gap-2  position-relative
                px-0 justify-content-center align-items-center border rounded-3`}
                style={{ width: '320px', height: '180px' }}
            >
                {!imgPreview && allowEdit && (
                    <>
                        <TooltipOverlay
                            id='upload'
                            tooltipMessage={t('uploadImage')}
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
                                    alt={t('uploadImage')}
                                    onLoad={handleImageLoad}
                                />
                            </Button>
                        </TooltipOverlay>
                        <div>{t('uploadImage')}</div>
                    </>
                )}
                {!imgPreview && !allowEdit && <div>{t('noImage')}</div>}
                {imgPreview && (
                    <>
                        {allowEdit && (
                            <TooltipOverlay
                                id='clear'
                                tooltipMessage={t('clearImage')}
                                placement='top'
                            >
                                <CloseButton
                                    onClick={handleClearImage}
                                    className='position-absolute top-0 end-0 mt-2 me-2'
                                />
                            </TooltipOverlay>
                        )}
                        <Image
                            src={imgPreview}
                            alt={imgName}
                            onLoad={handleImageLoad}
                            className={`${
                                isLoading ? 'd-none' : ''
                            } h-100 w-100 rounded-3 object-fit-contain`}
                        />
                        {isLoading && (
                            <Container className='d-flex justify-content-center align-items-center'>
                                <Spinner />
                            </Container>
                        )}
                    </>
                )}
            </Container>
        </Form.Group>
    );
});

export default CollectionImg;
