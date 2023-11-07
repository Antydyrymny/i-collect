import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { isStringError } from '../types';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

export const useInformOfError = (
    isError: boolean,
    error: FetchBaseQueryError | SerializedError | undefined
) => {
    useEffect(() => {
        if (isError) {
            toast.error(isStringError(error) ? error.data : 'Error connecting to server');
        }

        return () => toast.dismiss();
    }, [error, isError]);
};
