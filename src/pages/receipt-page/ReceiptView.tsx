import React, { useState } from 'react';
import { StateContext } from '../../rxjs-as-redux/storeInstances';
import { Receipt } from '../../config/DomainTypes';
import { useParams } from 'react-router-dom';
import RoutedPage from '../page-wrapper/RoutedPage';
import Field from '../../components/InputField'
import buttonStyles from '../../components/Button/Button.module.css'
const monthsToSeconds = months => parseInt(months, 10) * 12 * 24 * 60 * 60;

const ReceiptView = () => {
  const fromParams = useParams();
  return (
    <StateContext.Consumer>
      {({ receipts, selectedReceipt }) => {
        const receipt: Receipt | undefined = receipts.byId[(selectedReceipt || fromParams).id];
        return (
          <>
            {receipt && (
              <RoutedPage pageTitle="Receipt Info">
                <ReceiptForm receipt={receipt} />
              </RoutedPage>
            )}
          </>
        );
      }}
    </StateContext.Consumer>
  );
};
type Props = {
  receipt: Receipt;
};
const ReceiptForm = ({ receipt }: Props) => {
  const [itemName, setItemName] = useState(receipt.itemName || '');
  const [shopName, setShopName] = useState(receipt.shopName || '');
  const [date, setDate] = useState(
    new Date(receipt.buyDate || receipt.creationDate || Date()).toISOString().substr(0, 10)
  );
  const [image, setImage] = useState(receipt.image || '');
  const [totalPrice, setTotalPrice] = useState(receipt.totalPrice || '');
  const [warrantyPeriod, setWarrantyPeriod] = useState(receipt.warrantyPeriod || '');

  const handleSubmit = e => {
    e.preventDefault();
    console.log([{itemName}, {shopName}, {date}, {image}, {totalPrice}, {warrantyPeriod: monthsToSeconds(warrantyPeriod)}]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field text="Item name" value={itemName} setter={setItemName} />
      <Field text="Shop" value={shopName} setter={setShopName} />
      <Field text="Date" value={date} setter={setDate} type="date" />
      <Field text="Image" value={image} setter={setImage} />
      <Field text="Price" value={totalPrice} setter={setTotalPrice} type="number" />
      <Field text="Warranty Period (in months)" value={warrantyPeriod} setter={setWarrantyPeriod} type="number" />

      <input type="submit" value="Submit" className={buttonStyles.blackAndWhite} />
    </form>
  );
};

export default ReceiptView;
