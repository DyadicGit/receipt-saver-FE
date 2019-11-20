import { InitialState } from '../rxjs-as-redux/storeInstances';

export interface Receipt {
  id: string;
  creationDate: number;
  images: string[];
  shopName: string;
  itemId: string;
  itemName: string;
  buyDate?: number;
  totalPrice: number;
  warrantyPeriod: number; // in seconds
  userID: string;
}

export type ReceiptWithImages = { receipt: Receipt; images: ImageData[] };
export type ImageData = { buffer: { type: string; data: Buffer }; contentType: string; key: string };

export type NormalizedReceipt = { [id: string]: Receipt }
export interface NormalizedReceipts {
  byId: NormalizedReceipt;
  order: string[];
}

export interface GlobalState extends InitialState {}
