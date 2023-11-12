import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { isMessageError, isStringError } from '../types';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

type InformOfErrorParam = {
    isError: boolean;
    error: FetchBaseQueryError | SerializedError | undefined;
};
export const useInformOfError = (
    queryError: InformOfErrorParam | InformOfErrorParam[]
) => {
    useEffect(() => {
        const informOfError = (errParam: InformOfErrorParam) => {
            if (errParam.isError) {
                toast.error(
                    isStringError(errParam.error)
                        ? errParam.error.data
                        : isMessageError(errParam.error)
                        ? errParam.error.data.message
                        : 'Error connecting to server'
                );
            }
        };

        if (Array.isArray(queryError)) {
            queryError.forEach((errParam) => informOfError(errParam));
        } else informOfError(queryError);

        return () => toast.dismiss();
    }, [queryError]);
};
