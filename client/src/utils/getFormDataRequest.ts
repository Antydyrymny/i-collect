export const getFormDataRequest = (request: object): FormData => {
    const formRequest = new FormData();
    Object.entries(request).forEach(([key, value]) => formRequest.append(key, value));

    return formRequest;
};
