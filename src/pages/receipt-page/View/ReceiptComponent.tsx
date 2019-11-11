import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';
import { Receipt } from '../../../config/DomainTypes';
import { createReceipt, deleteReceipt, editReceipt } from '../receiptActions';
import Field from '../../../components/InputField';
import buttonStyles from '../../../components/Button/Button.module.css';
import { Mode } from './ReceiptContainer';
import { monthsToSeconds, secondsToMonths, toNumber } from "../utils";

const isDisabled = { EDIT: false, VIEW: true, CREATE: false };

type ReceiptFormProps = {
  receipt: Receipt;
  mode: Mode;
  onEditClick: (mode: Mode) => void;
};
const ReceiptForm = ({ receipt, mode, onEditClick: toggleMode }: ReceiptFormProps) => {
  const [itemName, setItemName] = useState((receipt && receipt.itemName) || '');
  const [shopName, setShopName] = useState((receipt && receipt.shopName) || '');
  const [date, setDate] = useState(
    new Date(toNumber((receipt && receipt.buyDate) || (receipt && receipt.creationDate)) || Date()).toISOString().substr(0, 10)
  );
  const [image, setImage] = useState((receipt && receipt.image) || '');
  const [totalPrice, setTotalPrice] = useState((receipt && receipt.totalPrice) || 0);
  const [warrantyPeriod, setWarrantyPeriod] = useState(secondsToMonths(receipt && receipt.warrantyPeriod) || 0);
  const history = useHistory();

  const handleSubmit = e => {
    e.preventDefault();
    // console.log([{ itemName }, { shopName }, { date }, { image }, { totalPrice }, { warrantyPeriod: monthsToSeconds(warrantyPeriod) }]);
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
    toggleMode('VIEW');
  };
  const handleDelete = () => {
    history.push(`/receipt`);
    deleteReceipt(receipt.id);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field text="Item name" value={itemName} setter={setItemName} disabled={isDisabled[mode]} />
      <Field text="Shop" value={shopName} setter={setShopName} disabled={isDisabled[mode]} />
      <Field text="Date" value={date} setter={setDate} type="date" disabled={isDisabled[mode]} />
      <Field text="Image" value={image} setter={setImage} disabled={isDisabled[mode]} />
      <Field text="Price" value={totalPrice} setter={setTotalPrice} type="number" disabled={isDisabled[mode]} />
      <Field text="Warranty Period (in months)" value={warrantyPeriod} setter={setWarrantyPeriod} type="number" disabled={isDisabled[mode]} />

      <br />
      <br />
      {(mode === 'EDIT' || mode === 'CREATE') && <input type="submit" value="Submit" className={buttonStyles.blackAndWhite} />}
      {mode === 'VIEW' && <input type="button" value="Edit" className={buttonStyles.blackAndWhite} onClick={() => toggleMode('EDIT')} />}
      {mode === 'VIEW' && (
        <input
          type="button"
          value="Delete"
          className={cx(buttonStyles.blackAndWhite, buttonStyles.red)}
          style={{ float: 'right' }}
          onClick={handleDelete}
        />
      )}
    </form>
  );
};

export default ReceiptForm;
