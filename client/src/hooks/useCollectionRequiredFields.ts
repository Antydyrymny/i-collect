import { useCallback, useState } from 'react';
import { NewCollectionReq } from '../types';

export const useCollectionMainFields = (
    defaultMainState: Pick<NewCollectionReq, 'name' | 'description' | 'theme'>,
    defaultImgState: {
        file: File | null;
        imgPreview: string | undefined;
    }
) => {
    const [mainFields, setMainFields] = useState(defaultMainState);
    const [imageData, setImageData] = useState(defaultImgState);

    const handleMainStateChange = useCallback(
        <T extends 'name' | 'description' | 'theme'>(param: T) =>
            (
                e: T extends 'theme'
                    ? React.ChangeEvent<HTMLSelectElement>
                    : React.ChangeEvent<HTMLInputElement>
            ) =>
                setMainFields((prevState) => ({
                    ...prevState,
                    [param]: e.target.value,
                })),
        []
    );
    const resetMainState = useCallback(
        () => setMainFields(defaultMainState),
        [defaultMainState]
    );

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

    return {
        mainFields,
        resetMainState,
        handleMainStateChange,
        imageData,
        handleImageChange,
        clearImage,
    };
};
