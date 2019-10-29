import { createStore } from './RxStore';
import React from 'react';
import receiptReducer from '../pages/receipt-page/receiptReducer';
import { Receipt } from '../config/DomainTypes';
import { receiptApi } from '../config/endpoints';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface InitialState {
  isLoading: boolean;
  receipts: Receipt[];
  selectedReceipt: string | null;
}
const initState: InitialState = { isLoading: true, receipts: [], selectedReceipt: null };

const initAsyncState: Observable<InitialState> = ajax(receiptApi).pipe(
  map(({ response: receipts }) => {
    return receiptReducer(initState, {
      type: 'RECEIPTS_LOADED',
      payload: receipts
    });
  })
);

export const receiptStore = createStore(initAsyncState, receiptReducer);
export const StateContext = React.createContext(initState);
