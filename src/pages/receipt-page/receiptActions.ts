import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { receiptStore } from '../../rxjs-as-redux/storeInstances';
import { Action, ResolvableAction } from '../../rxjs-as-redux/RxStore';
import { createReceiptApi, deleteReceiptApi, editReceiptApi, getAllReceiptsApi } from '../../config/endpoints';

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

type SelectReceipt = (receiptId: string | null) => Action;
export const selectReceipt: SelectReceipt = receiptStore.actionCreator((receiptId: string) => ({
  type: 'RECEIPT_SELECTED',
  payload: receiptId
}));

type EditReceipt = (editedReceipt: FormData) => Action;
export const editReceipt: EditReceipt = receiptStore.actionCreator((editedReceipt: FormData) => {
  return {
    type: 'LOADING',
    payload: ajax.put(editReceiptApi, editedReceipt).pipe(
      map(({ response: receipt }): Action => ({
        type: 'RECEIPT_EDITED',
        payload: receipt
      }))
    )
  }
});
type CreateReceipt = (createdReceipt: FormData) => Action;
export const createReceipt: CreateReceipt = receiptStore.actionCreator((createdReceipt: FormData) => {
  return {
    type: 'LOADING',
    payload: ajax.post(createReceiptApi, createdReceipt).pipe(
      map(({ response: receipt }): Action => ({
        type: 'RECEIPT_CREATED',
        payload: receipt
      }))
    )
  }
});

type DeleteReceipt = (receiptId: string) => Action;
export const deleteReceipt: DeleteReceipt = receiptStore.actionCreator((receiptId: string) => {
  return {
    type: 'LOADING',
    payload: ajax.delete(deleteReceiptApi(receiptId)).pipe(
      map(({ response }): Action => {
        if (response.success) {
          return ({
            type: 'RECEIPT_DELETED',
            payload: { id: receiptId }
          });
        } else {
          throw new Error(response.error)
        }
      })
    )
  }
})
