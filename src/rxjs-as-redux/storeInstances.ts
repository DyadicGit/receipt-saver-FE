import { createStore } from './RxStore';
import React from 'react';
import receiptReducer from '../pages/receipt-page/receiptReducer';
import { NormalizedReceipts, ResponsiveImageData, ResponsiveImageDataList } from '../config/DomainTypes';
import { getAllReceiptsApi } from '../config/endpoints';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface InitialState {
  isLoading: boolean;
  receipts: NormalizedReceipts;
  selectedReceipt: SelectedReceiptState;
  seriousError: boolean;
}
export type SelectedReceiptState = SelectedReceiptStateType | null;
export type SelectedReceiptStateType = { id: string; images: ResponsiveImageDataList };

export const initState: InitialState = { isLoading: true, receipts: { byId: {}, order: [] }, selectedReceipt: null, seriousError: false };

const initAsyncState: Observable<InitialState> = ajax(getAllReceiptsApi).pipe(
  map(({ response: receipts }) => {
    return receiptReducer(initState, {
      type: 'RECEIPTS_LOADED',
      payload: receipts
    });
  })
);

export const receiptStore = createStore(initAsyncState, receiptReducer);
export const StateContext = React.createContext(initState);
