import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { receiptStore } from '../../rxjs-as-redux/storeInstances';
import { Action, ResolvableAction } from '../../rxjs-as-redux/RxStore';
import { getAllReceiptsApi } from '../../config/endpoints';

type NoParams = () => ResolvableAction;
export const getAllReceipts: NoParams = receiptStore.actionCreator(() => {
  return {
    type: 'RECEIPTS_LOADING',
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
