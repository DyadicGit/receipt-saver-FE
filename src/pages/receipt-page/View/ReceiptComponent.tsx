import React, { useState } from 'react';
import { Receipt } from '../../../config/DomainTypes';
import { createReceipt, editReceipt } from '../receiptActions';
import Field from '../../../components/InputField';
import { Mode } from './ReceiptContainer';
import { monthsToSeconds, secondsToMonths, toNumber } from '../utils';

const isDisabled = { EDIT: false, VIEW: true, CREATE: false };

type ReceiptFormProps = {
  formId: string;
  receipt: Receipt;
  mode: Mode;
  setMode: (mode: Mode) => void;
};
const ReceiptForm = ({ formId, receipt, mode, setMode }: ReceiptFormProps) => {
  const [itemName, setItemName] = useState((receipt && receipt.itemName) || '');
  const [shopName, setShopName] = useState((receipt && receipt.shopName) || '');
  const [date, setDate] = useState(
    new Date(toNumber((receipt && receipt.buyDate) || (receipt && receipt.creationDate)) || Date()).toISOString().substr(0, 10)
  );
  const [image, setImage] = useState((receipt && receipt.image) || '');
  const [totalPrice, setTotalPrice] = useState((receipt && receipt.totalPrice) || 0);
  const [warrantyPeriod, setWarrantyPeriod] = useState(secondsToMonths(receipt && receipt.warrantyPeriod) || 0);

  const handleSubmit = e => {
    e.preventDefault();
    console.log([{ itemName }, { shopName }, { date }, { image }, { totalPrice }, { warrantyPeriod: monthsToSeconds(warrantyPeriod) }]);
    const newReceipt: Receipt = {
      ...receipt,
      itemName,
      shopName,
      buyDate: Date.parse(`${date} ${new Date().getHours()}:${new Date().getMinutes()}`),
      image,
      totalPrice,
      warrantyPeriod: monthsToSeconds(warrantyPeriod)
    };
    if (mode === 'EDIT') editReceipt(newReceipt);
    if (mode === 'CREATE') createReceipt(newReceipt);
    setMode('VIEW');
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <Field text="Item name" value={itemName} setter={setItemName} disabled={isDisabled[mode]} />
      <Field text="Shop" value={shopName} setter={setShopName} disabled={isDisabled[mode]} />
      <Field text="Date" value={date} setter={setDate} type="date" disabled={isDisabled[mode]} />
      <Field text="Image" value={image} setter={setImage} disabled={isDisabled[mode]} />
      <Field text="Price" value={totalPrice} setter={setTotalPrice} type="number" disabled={isDisabled[mode]} />
      <Field text="Warranty Period (in months)" value={warrantyPeriod} setter={setWarrantyPeriod} type="number" disabled={isDisabled[mode]} />
    </form>
  );
};

export default ReceiptForm;
