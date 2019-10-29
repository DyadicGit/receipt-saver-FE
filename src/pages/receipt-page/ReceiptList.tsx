import React from 'react';
import { Receipt } from '../../config/DomainTypes';
import { selectReceipt } from './receiptActions';
import { Link } from 'react-router-dom';
import { StateContext } from '../../rxjs-as-redux/storeInstances';
import RoutedPage from '../page-wrapper/RoutedPage';

const receiptLine = (receipt: Receipt) => (
  <li key={receipt.id}>
    <div>{receipt.itemName}</div>
    <div>{receipt.shopName}</div>
    <div>{receipt.buyDate || receipt.creationDate}</div>
    <Link to={`/receipt/${receipt.id}`} onClick={() => selectReceipt(receipt.id)}>
      =>>
    </Link>
  </li>
);

const ReceiptList = ({ receipts }: { receipts: Receipt[] }) => {
  return <ul className="receipt-list">{receipts && receipts.map(receiptLine)}</ul>;
};

const ReceiptPage = () => {
  return (
    <StateContext.Consumer>
      {({ receipts, isLoading }) => (
        <RoutedPage pageTitle="Receipt list">
          {isLoading && <p>Loading...</p>}
          <ReceiptList receipts={receipts} />
        </RoutedPage>
      )}
    </StateContext.Consumer>
  );
};
export default ReceiptPage;
