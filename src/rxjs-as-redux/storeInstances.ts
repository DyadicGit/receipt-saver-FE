import { createStore } from './RxStore';
import React from 'react';
import receiptReducer from '../pages/receipt-page/receiptReducer';
import { NormalizedReceipts } from '../config/DomainTypes';
import { getAllReceiptsApi } from '../config/endpoints';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface InitialState {
  isLoading: boolean;
  receipts: NormalizedReceipts;
  selectedReceipt: SelectedReceiptState | null;
}
export type SelectedReceiptState = { id: string; images: ImageState[] };
export type ImageState = { key: string | undefined; url: string; file: File | undefined };

export const initState: InitialState = { isLoading: true, receipts: { byId: {}, order: [] }, selectedReceipt: null };

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
