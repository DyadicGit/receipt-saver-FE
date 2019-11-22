import { of } from "rxjs";

export const clearSelectedReceipt$ = of({
  type: 'RECEIPT_SELECTED_CLEARED'
});
