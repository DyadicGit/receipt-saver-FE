import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { ImageState, receiptStore, SelectedReceiptState } from '../../rxjs-as-redux/storeInstances';
import { Action, ResolvableAction } from '../../rxjs-as-redux/RxStore';
import {
  AttachmentFieldName,
  createReceiptApi,
  deleteReceiptApi,
  editReceiptApi,
  getAllReceiptsApi,
  getImagesByReceiptIdApi
} from '../../config/endpoints';
import { ImageData, Receipt, ReceiptWithImages } from '../../config/DomainTypes';
import { EditCreateReceiptAction } from "./receiptReducer";
import { merge, of } from "rxjs";

type NoParams = () => ResolvableAction;
export const getAllReceipts: NoParams = receiptStore.actionCreator(() => {
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

type SelectReceipt = (receiptId: string | null) => Action;
export const selectReceiptAndLoadItsImages: SelectReceipt = receiptStore.actionCreator((receiptId: string) => {
  return {
    type: 'LOADING',
    payload: merge(of({
      type: 'RECEIPT_SELECTED_CLEARED'
    }),ajax.get(getImagesByReceiptIdApi(receiptId)).pipe(
      map(({ response: imageResponses }: { response: ImageData[] }): Action & { payload: SelectedReceiptState } => {
        return {
          type: 'RECEIPT_SELECTED',
          payload: {
            id: receiptId,
            images: toImageStateList(imageResponses)
          }
        };
      })
    ))
  };
});
export const dispatchSeriousError = receiptStore.actionCreator(() => ({type: 'ERROR'}));

const toMultipartFormData = (receipt: Receipt, uploadedImages: File[]): FormData => {
  const formData = new FormData();
  formData.set('receipt', JSON.stringify(receipt));
  uploadedImages.forEach(image => formData.append(AttachmentFieldName.RECEIPT, image as any));
  return formData;
};
type EditReceipt = (receipt: Receipt, uploadedImages: File[]) => Action;
export const editReceipt: EditReceipt = receiptStore.actionCreator((receipt: Receipt, uploadedImages: File[]) => {
  return {
    type: 'LOADING',
    payload: ajax.put(editReceiptApi, toMultipartFormData(receipt, uploadedImages)).pipe(
      map(({ response }: { response: ReceiptWithImages }): EditCreateReceiptAction => ({
        type: 'RECEIPT_EDITED',
        payload: { receipt: response.receipt, images: toImageStateList(response.images) }
      }))
    )
  };
});
type CreateReceipt = (receipt: Receipt, uploadedImages: File[]) => Action & { payload: ReceiptWithImages };
export const createReceipt: CreateReceipt = receiptStore.actionCreator((receipt: Receipt, uploadedImages: File[]) => {
  return {
    type: 'LOADING',
    payload: ajax.post(createReceiptApi, toMultipartFormData(receipt, uploadedImages)).pipe(
      map(({ response }: { response: ReceiptWithImages }): EditCreateReceiptAction => ({
        type: 'RECEIPT_CREATED',
        payload: { receipt: response.receipt, images: toImageStateList(response.images) }
      }))
    )
  };
});

type DeleteReceipt = (receiptId: string) => Action;
export const deleteReceipt: DeleteReceipt = receiptStore.actionCreator((receiptId: string) => {
  return {
    type: 'LOADING',
    payload: ajax.delete(deleteReceiptApi(receiptId)).pipe(
      map(
        ({ response }): Action => {
          if (response.success) {
            return {
              type: 'RECEIPT_DELETED',
              payload: { id: receiptId }
            };
          } else {
            throw new Error(response.error);
          }
        }
      )
    )
  };
});
