import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { receiptStore, SelectedReceiptState } from '../../rxjs-as-redux/storeInstances';
import { Action, ResolvableAction } from '../../rxjs-as-redux/RxStore';
import { createReceiptApi, deleteReceiptApi, editReceiptApi, getAllReceiptsApi, getImageByReceiptIdApi } from '../../config/endpoints';
import { toUrl } from '../../config/utils';

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

type ImageResponse = { buffer: { type: string; data: Buffer }; contentType: string; key: string };
type SelectReceipt = (receiptId: string | null) => Action;
export const selectReceiptAndLoadItsImages: SelectReceipt = receiptStore.actionCreator((receiptId: string) => {
  return {
    type: 'LOADING',
    payload: ajax.get(getImageByReceiptIdApi(receiptId)).pipe(
      map(({ response: imageResponses }: { response: ImageResponse[] }): Action & { payload: SelectedReceiptState } => {
        return {
          type: 'RECEIPT_SELECTED',
          payload: {
            id: receiptId,
            images: imageResponses ? imageResponses.map(resp => ({ file: undefined, key: resp.key, url: toUrl(resp.buffer.data, resp.contentType), userUploaded: false })) : []
          }
        };
      })
    )
  };
});

type EditReceipt = (editedReceipt: FormData) => Action;
export const editReceipt: EditReceipt = receiptStore.actionCreator((editedReceipt: FormData) => {
  return {
    type: 'LOADING',
    payload: ajax.put(editReceiptApi, editedReceipt).pipe(
      map(
        ({ response: receipt }): Action => ({
          type: 'RECEIPT_EDITED',
          payload: receipt
        })
      )
    )
  };
});
type CreateReceipt = (createdReceipt: FormData) => Action;
export const createReceipt: CreateReceipt = receiptStore.actionCreator((createdReceipt: FormData) => {
  return {
    type: 'LOADING',
    payload: ajax.post(createReceiptApi, createdReceipt).pipe(
      map(
        ({ response: receipt }): Action => ({
          type: 'RECEIPT_CREATED',
          payload: receipt
        })
      )
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
