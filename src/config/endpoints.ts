const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export const helloWorldApi = baseUrl + '/helloWorld';
export const getAllReceiptsApi = baseUrl + '/receipt';
export const editReceiptApi = baseUrl + '/receipt';
export const deleteReceiptApi = (id: string) => `${baseUrl}/receipt/${id}`;
