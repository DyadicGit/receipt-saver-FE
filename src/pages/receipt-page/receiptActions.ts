import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { receiptStore } from '../../rxjs-as-redux/storeInstances';
import { Action, ResolvableAction } from '../../rxjs-as-redux/RxStore';
import { deleteReceiptApi, editReceiptApi, getAllReceiptsApi } from '../../config/endpoints';
import { Receipt } from "../../config/DomainTypes";

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

type SelectReceipt = (receiptId: string) => Action;
export const selectReceipt: SelectReceipt = receiptStore.actionCreator((receiptId: string) => ({
  type: 'RECEIPT_SELECTED',
  payload: receiptId
}));

type EditReceipt = (editedReceipt: Receipt) => Action;
export const editReceipt: EditReceipt = receiptStore.actionCreator((editedReceipt: Receipt) => {
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

type DeleteReceipt = (receiptId: string) => Action;
export const deleteReceipt: DeleteReceipt = receiptStore.actionCreator((receiptId: string) => {
  return {
    type: 'LOADING',
    payload: ajax.delete(deleteReceiptApi(receiptId)).pipe(
      map(({ response }): Action => {
        if (response.success) {
          return ({
            type: 'RECEIPT_DELETED',
            payload: {id: receiptId}
          });
        } else {
          throw new Error(response.error)
        }
      })
    )
  }
})
