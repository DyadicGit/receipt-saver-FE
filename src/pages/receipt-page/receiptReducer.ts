import { Action } from '../../rxjs-as-redux/RxStore';

export default (state: any, action: Action) =>
  ({
    RECEIPTS_LOADING: {
      ...state,
      isLoading: true
    },
    RECEIPTS_LOADED: {
      ...state,
      isLoading: false,
      receipts: action.payload
    },
    RECEIPT_SELECTED: {
      ...state,
      isLoading: false,
      receiptId: { id: action.payload }
    }
  }[action.type] || state);
