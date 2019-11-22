import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { ImageState, receiptStore, SelectedReceiptState } from '../../rxjs-as-redux/storeInstances';
import { Action, AsyncAction, SyncAction } from '../../rxjs-as-redux/RxStore';
import {
  AttachmentFieldName,
  createReceiptApi,
  deleteReceiptApi,
  editReceiptApi,
  getAllReceiptsApi,
  getImagesByReceiptIdApi
} from '../../config/endpoints';
import { ImageData, Receipt, ReceiptWithImages } from '../../config/DomainTypes';
import { EditCreateReceiptPayload } from './receiptReducer';
import { merge } from 'rxjs';
import { clearSelectedReceipt$ } from './receiptActions';

type ErrorPayload = SyncAction<undefined>;
type DispatchSeriousError = () => Action<ErrorPayload>;
export const dispatchSeriousError: DispatchSeriousError = receiptStore.actionCreator<ErrorPayload>(() => ({ type: 'ERROR' }));

export const getAllReceipts = receiptStore.actionCreator(() => {
  return {
    type: 'LOADING',
    payload: ajax(getAllReceiptsApi).pipe(
      map(({ response: receipts }) => ({
        type: 'RECEIPTS_LOADED',
        payload: receipts
      }))
    )
  };
});

const toImageStateList = (imagesData: ImageData[]): ImageState[] => {
  return imagesData.map(({ key, url }) => ({ file: undefined, key, url, userUploaded: false })) || [];
};

type SelectReceiptPayload = AsyncAction<SelectedReceiptState>;
type SelectReceipt = (receiptId: string) => Action<SelectReceiptPayload>;
export const selectReceiptAndFetchItsImages: SelectReceipt = receiptStore.actionCreator<SelectReceiptPayload>((receiptId: string) => {
  return {
    type: 'LOADING',
    payload: merge(
      clearSelectedReceipt$,
      ajax.get(getImagesByReceiptIdApi(receiptId)).pipe(
        map(({ response: imageResponses }: { response: ImageData[] }) => {
          return {
            type: 'RECEIPT_SELECTED',
            payload: {
              id: receiptId,
              images: toImageStateList(imageResponses)
            }
          };
        })
      )
    )
  };
});

const toMultipartFormData = (receipt: Receipt, uploadedImages: File[]): FormData => {
  const formData = new FormData();
  formData.set('receipt', JSON.stringify(receipt));
  uploadedImages.forEach(image => formData.append(AttachmentFieldName.RECEIPT, image as any));
  return formData;
};

type EditReceipt = (receipt: Receipt, uploadedImages: File[]) => Action<AsyncAction<EditCreateReceiptPayload>>;
export const editReceipt: EditReceipt = receiptStore.actionCreator((receipt: Receipt, uploadedImages: File[]) => {
  return {
    type: 'LOADING',
    payload: ajax.put(editReceiptApi, toMultipartFormData(receipt, uploadedImages)).pipe(
      map(
        ({ response }: { response: ReceiptWithImages }): SyncAction<EditCreateReceiptPayload> => ({
          type: 'RECEIPT_EDITED',
          payload: { receipt: response.receipt, images: toImageStateList(response.images) }
        })
      )
    )
  };
});
type CreateReceipt = (receipt: Receipt, uploadedImages: File[]) => Action<AsyncAction<EditCreateReceiptPayload>>;
export const createReceipt: CreateReceipt = receiptStore.actionCreator((receipt: Receipt, uploadedImages: File[]) => {
  return {
    type: 'LOADING',
    payload: ajax.post(createReceiptApi, toMultipartFormData(receipt, uploadedImages)).pipe(
      map(
        ({ response }: { response: ReceiptWithImages }): SyncAction<EditCreateReceiptPayload> => ({
          type: 'RECEIPT_CREATED',
          payload: { receipt: response.receipt, images: toImageStateList(response.images) }
        })
      )
    )
  };
});

type DeleteReceipt = (receiptId: string) => Action<AsyncAction<{ id: string }>>;
export const deleteReceipt: DeleteReceipt = receiptStore.actionCreator((receiptId: string) => {
  return {
    type: 'LOADING',
    payload: ajax.delete(deleteReceiptApi(receiptId)).pipe(
      map(({ response }) => {
        if (response.success) {
          return {
            type: 'RECEIPT_DELETED',
            payload: { id: receiptId }
          };
        } else {
          throw new Error(response.error);
        }
      })
    )
  };
});
