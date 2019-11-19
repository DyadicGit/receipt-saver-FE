import { Action } from '../../rxjs-as-redux/RxStore';
import { GlobalState } from "../../config/DomainTypes";

export default (state: GlobalState, action: Action) =>
  ({
    LOADING: {
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
      selectedReceipt: action.payload
    },
    RECEIPT_EDITED: {
      ...state,
      isLoading: false,
      receipts: { ...state.receipts, byId: { ...state.receipts.byId, [action.payload.id]: action.payload } }
    },
    RECEIPT_DELETED: {
      ...state,
      isLoading: false,
      selectedReceipt: null,
      receipts: {
        byId: (({ [action.payload.id]: toDelete, ...toKeep }) => toKeep)(state.receipts.byId),
        order: state.receipts.order.filter(id => id !== action.payload.id)
      }
    },
    RECEIPT_CREATED: {
      ...state,
      isLoading: false,
      receipts: {
        ...state.receipts,
        byId: { ...state.receipts.byId, [action.payload.id]: action.payload },
        order: [action.payload.id, ...state.receipts.order]
      },
      selectedReceipt: {id: action.payload.id, images: action.payload.images}
    },
  }[action.type] || state);
