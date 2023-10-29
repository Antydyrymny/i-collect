export type FetchError = {
    status: number;
    data: string;
};

export function isFetchError(error: unknown): error is FetchError {
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
