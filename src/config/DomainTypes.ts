import { InitialState } from "../rxjs-as-redux/storeInstances";

export interface Receipt extends RequestReceipt {
  id: string;
  creationDate: number;
}

export interface RequestReceipt {
  image: string;
  shopName: string;
  itemId: string;
  itemName: string;
  buyDate?: number;
  totalPrice: number;
  warrantyPeriod: number; // in seconds
  userID: string;
}

export interface NormalizedReceipts {
  byId: { [id: string]: Receipt };
  order: string[];
}

export interface GlobalState extends InitialState{

}
