const baseUrl = process.env.REACT_APP_API_URL;
export const helloWorldApi = baseUrl + '/helloWorld';
export const getAllReceiptsApi = baseUrl + '/receipt';
export const editReceiptApi = baseUrl + '/receipt';
export const createReceiptApi = baseUrl + '/receipt';
export const deleteReceiptApi = (id: string) => `${baseUrl}/receipt/${id}`;
export const getImagesByReceiptIdApi = (id: string) => `${baseUrl}/image/byReceiptId/${id}`;
export const detectUploadedApi = baseUrl + '/image/detectUploaded';
export const detectExistingApi = baseUrl + '/image/detectExisting';
