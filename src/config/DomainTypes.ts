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

export type ImageKey = { orig: string; px320: string; px600: string; px900: string };
export type ReceiptWithImages = { receipt: Receipt; images: ResponsiveImageDataList };
export type ResponsiveImageDataList = ResponsiveImageData[];
export type ResponsiveImageData = { orig: ImageData; px320: ImageData; px600: ImageData; px900: ImageData };
export type ImageData = { url: string; key: string };
export interface RequestWithReceiptAndFiles {
  receipt: Receipt;
  uploadedImages: UploadedImages[];
}
export interface UploadedImages {
  base64: string;
  contentType: string;
}

export type NormalizedReceipt = { [id: string]: Receipt };
export interface NormalizedReceipts {
  byId: NormalizedReceipt;
  order: string[];
}

export interface GlobalState extends InitialState {}
