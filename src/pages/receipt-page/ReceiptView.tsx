import React, { useState } from 'react';
import { StateContext } from '../../rxjs-as-redux/storeInstances';
import { Receipt } from '../../config/DomainTypes';
import { useParams } from 'react-router-dom';
import cx from 'classnames';
import RoutedPage from '../page-wrapper/RoutedPage';
import Field from '../../components/InputField';
import buttonStyles from '../../components/Button/Button.module.css';
const monthsToSeconds = months => parseInt(months, 10) * 12 * 24 * 60 * 60;

type Mode = 'EDIT' | 'VIEW';
const isDisabled = { EDIT: false, VIEW: true };

const ReceiptView = () => {
  const [mode, setMode]: [Mode, any] = useState('VIEW');
  const [pageTitle, setPageTitle] = useState('Receipt Info');
  const fromParams = useParams();
  const toggleModeAndPageTitle = () => {
    if (mode === 'VIEW') {
      setMode('EDIT');
      setPageTitle('Receipt Edit');
    } else {
      setMode('VIEW');
      setPageTitle('Receipt Info');
    }
  };

  return (
    <StateContext.Consumer>
      {({ receipts, selectedReceipt }) => {
        const receipt: Receipt | undefined = receipts.byId[(selectedReceipt || fromParams).id];
        return (
          <>
            {receipt && (
              <RoutedPage pageTitle={pageTitle}>
                <ReceiptForm receipt={receipt} mode={mode} onEditClick={toggleModeAndPageTitle} />
              </RoutedPage>
            )}
          </>
        );
      }}
    </StateContext.Consumer>
  );
};

type ReceiptFormProps = {
  receipt: Receipt;
  mode: Mode;
  onEditClick: () => void;
};
const ReceiptForm = ({ receipt, mode, onEditClick: handleEditClick }: ReceiptFormProps) => {
  const [itemName, setItemName] = useState(receipt.itemName || '');
  const [shopName, setShopName] = useState(receipt.shopName || '');
  const [date, setDate] = useState(new Date(receipt.buyDate || receipt.creationDate || Date()).toISOString().substr(0, 10));
  const [image, setImage] = useState(receipt.image || '');
  const [totalPrice, setTotalPrice] = useState(receipt.totalPrice || '');
  const [warrantyPeriod, setWarrantyPeriod] = useState(receipt.warrantyPeriod || '');

  const handleSubmit = e => {
    e.preventDefault();
    console.log([{ itemName }, { shopName }, { date }, { image }, { totalPrice }, { warrantyPeriod: monthsToSeconds(warrantyPeriod) }]);
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
      {mode === 'EDIT' && <input type="submit" value="Submit" className={buttonStyles.blackAndWhite} />}
      {mode === 'VIEW' && <input type="button" value="Edit" className={buttonStyles.blackAndWhite} onClick={handleEditClick} />}
      {mode === 'VIEW' && (
        <input
          type="button"
          value="Delete"
          className={cx(buttonStyles.blackAndWhite, buttonStyles.red)}
          style={{ float: 'right' }}
          onClick={() => console.log('send delete api call')}
        />
      )}
    </form>
  );
};

export default ReceiptView;
