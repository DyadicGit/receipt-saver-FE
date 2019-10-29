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
  warrantyPeriod: number, // in seconds
  userID: string;
}
