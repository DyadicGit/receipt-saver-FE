import { SyncAction } from '../../rxjs-as-redux/RxStore';
import { GlobalState, NormalizedReceipt, ReceiptWithImages } from '../../config/DomainTypes';
import { SelectedReceiptState } from '../../rxjs-as-redux/storeInstances';

const updateSelectedReceipt = (action: SyncAction<ReceiptWithImages>): SelectedReceiptState => {
  return { id: action.payload.receipt.id, images: action.payload.images };
};
const updateNormalizedReceipt = (action: SyncAction<ReceiptWithImages>): NormalizedReceipt => {
  return { [action.payload.receipt.id]: action.payload.receipt };
};

export default (state: GlobalState, action) =>
  ({
    LOADING: () => ({ ...state, isLoading: true }),
    LOADING_SET: () => ({ ...state, isLoading: action.payload }),
    ERROR: () => ({ seriousError: true }),
    RECEIPTS_LOADED: () => ({
      ...state,
      isLoading: false,
      receipts: action.payload
    }),
    RECEIPT_SELECTED_CLEARED: () => ({
      ...state,
      isLoading: true,
      selectedReceipt: null
    }),
    RECEIPT_SELECTED: () => ({
      ...state,
      isLoading: false,
      selectedReceipt: action.payload
    }),
    RECEIPT_EDITED: () => ({
      ...state,
      isLoading: false,
      receipts: {
        ...state.receipts,
        byId: { ...state.receipts.byId, ...updateNormalizedReceipt(action) }
      },
      selectedReceipt: updateSelectedReceipt(action)
    }),
    RECEIPT_DELETED: () => ({
      ...state,
      isLoading: false,
      selectedReceipt: null,
      receipts: {
        byId: (({ [action.payload.id]: toDelete, ...toKeep }) => toKeep)(state.receipts.byId),
        order: state.receipts.order.filter(id => id !== action.payload.id)
      }
    }),
    RECEIPT_CREATED: () => ({
      ...state,
      isLoading: false,
      receipts: {
        ...state.receipts,
        byId: { ...state.receipts.byId, ...updateNormalizedReceipt(action) },
        order: [action.payload.receipt.id, ...state.receipts.order]
      },
      selectedReceipt: updateSelectedReceipt(action)
    })
  }[action.type]() || state);
