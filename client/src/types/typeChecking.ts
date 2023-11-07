export type StringError = {
    status: number;
    data: string;
};

export function isStringError(error: unknown): error is StringError {
    if (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        'data' in error &&
        typeof error.status === 'number' &&
        typeof error.data === 'string'
    ) {
        return true;
    }
    return false;
}

export type MessageError = {
    status: number;
    data: {
        message: string;
    };
};

export function isMessageError(error: unknown): error is MessageError {
    if (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        'data' in error &&
        typeof error.status === 'number' &&
        typeof error.data === 'object' &&
        error.data !== null &&
        'message' in error.data &&
        typeof error.data.message === 'string'
    ) {
        return true;
    } else return false;
}
