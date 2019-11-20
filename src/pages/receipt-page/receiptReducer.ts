import { Action } from '../../rxjs-as-redux/RxStore';
import { GlobalState, NormalizedReceipt, Receipt } from '../../config/DomainTypes';
import { ImageState, SelectedReceiptState } from '../../rxjs-as-redux/storeInstances';

export type EditCreateReceiptAction = Action & { payload: { receipt: Receipt; images: ImageState[] } };
const updateSelectedReceipt = (action: EditCreateReceiptAction): SelectedReceiptState => {
  return { id: action.payload.receipt && action.payload.receipt.id, images: action.payload.images };
};
const updateNormalizedReceipt = (action: EditCreateReceiptAction): NormalizedReceipt => {
  return { [action.payload.receipt && action.payload.receipt.id]: action.payload.receipt };
};

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
      receipts: {
        ...state.receipts,
        byId: { ...state.receipts.byId, ...updateNormalizedReceipt(action) }
      },
      selectedReceipt: updateSelectedReceipt(action)
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
        byId: { ...state.receipts.byId, ...updateNormalizedReceipt(action) },
        order: [action.payload.receipt && action.payload.receipt.id, ...state.receipts.order]
      },
      selectedReceipt: updateSelectedReceipt(action)
    }
  }[action.type] || state);
