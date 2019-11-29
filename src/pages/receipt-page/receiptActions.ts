import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { receiptStore, SelectedReceiptState } from '../../rxjs-as-redux/storeInstances';
import { Action, AsyncAction, SyncAction } from '../../rxjs-as-redux/RxStore';
import { createReceiptApi, deleteReceiptApi, editReceiptApi, getAllReceiptsApi, getImagesByReceiptIdApi } from '../../config/endpoints';
import { Receipt, ReceiptWithImages, RequestWithReceiptAndFiles, ResponsiveImageDataList, UploadedImages } from '../../config/DomainTypes';
import { merge, of } from 'rxjs';

type ErrorPayload = SyncAction<undefined>;
type DispatchSeriousError = () => Action<ErrorPayload>;
export const dispatchSeriousError: DispatchSeriousError = receiptStore.actionCreator<ErrorPayload>(() => ({ type: 'ERROR' }));

type SetLoadingProps = (loading: boolean) => Action<SyncAction<boolean>>;
export const setGlobalLoading: SetLoadingProps = receiptStore.actionCreator<SyncAction<boolean>>((loading: boolean) => ({
  type: 'LOADING_SET',
  payload: loading
}));

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

const clearSelectedReceipt$ = of({
  type: 'RECEIPT_SELECTED_CLEARED'
});
type SelectReceiptPayload = AsyncAction<SelectedReceiptState>;
type SelectReceipt = (receiptId: string) => Action<SelectReceiptPayload>;
export const selectReceiptAndFetchItsImages: SelectReceipt = receiptStore.actionCreator<SelectReceiptPayload>((receiptId: string) => {
  return {
    type: 'LOADING',
    payload: merge(
      clearSelectedReceipt$,
      ajax.get(getImagesByReceiptIdApi(receiptId)).pipe(
        map(({ response }: { response: ResponsiveImageDataList }) => {
          return {
            type: 'RECEIPT_SELECTED',
            payload: {
              id: receiptId,
              images: response
            }
          };
        })
      )
    )
  };
});

const jsonTypeHeader = { 'Content-Type': 'application/json' };

type EditReceipt = (receipt: Receipt, uploadedImages: UploadedImages[]) => Action<AsyncAction<ReceiptWithImages>>;
export const editReceipt: EditReceipt = receiptStore.actionCreator((receipt: Receipt, uploadedImages: UploadedImages[]) => {
  const body = { receipt, uploadedImages };
  return {
    type: 'LOADING',
    payload: ajax.put(editReceiptApi, body, jsonTypeHeader).pipe(
      map(
        ({ response }: { response: ReceiptWithImages }): SyncAction<ReceiptWithImages> => ({
          type: 'RECEIPT_EDITED',
          payload: response
        })
      )
    )
  };
});

type CreateReceipt = (receipt: Receipt, uploadedImages: UploadedImages[]) => Action<AsyncAction<ReceiptWithImages>>;
export const createReceipt: CreateReceipt = receiptStore.actionCreator((receipt: Receipt, uploadedImages: UploadedImages[]) => {
  const body: RequestWithReceiptAndFiles = { receipt, uploadedImages };
  return {
    type: 'LOADING',
    payload: ajax.post(createReceiptApi, body, jsonTypeHeader).pipe(
      map(
        ({ response }: { response: ReceiptWithImages }): SyncAction<ReceiptWithImages> => ({
          type: 'RECEIPT_CREATED',
          payload: response
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
