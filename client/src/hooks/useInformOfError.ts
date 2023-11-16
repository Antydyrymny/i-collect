import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { isMessageError, isStringError } from '../types';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

type InformOfErrorParam = {
    isError: boolean;
    error: FetchBaseQueryError | SerializedError | undefined;
};
export function useInformOfError(queryError: InformOfErrorParam | InformOfErrorParam[]) {
    const queryErrorsRef = useRef(
        Array.isArray(queryError)
            ? queryError.map((errParam) => errParam.isError)
            : [queryError.isError]
    );

    useEffect(() => {
        const informOfError = (errParam: InformOfErrorParam, refInd: number) => {
            if (errParam.isError && !queryErrorsRef.current[refInd]) {
                queryErrorsRef.current[refInd] = true;
                toast.error(
                    isStringError(errParam.error)
                        ? errParam.error.data
                        : isMessageError(errParam.error)
                        ? errParam.error.data.message
                        : 'Error connecting to server'
                );
            } else if (!errParam.isError && queryErrorsRef.current[refInd]) {
                queryErrorsRef.current[refInd] = false;
            }
        };

        if (Array.isArray(queryError)) {
            queryError.forEach((errParam, ind) => informOfError(errParam, ind));
        } else informOfError(queryError, 0);

        return () => toast.dismiss();
    }, [queryError]);
}
