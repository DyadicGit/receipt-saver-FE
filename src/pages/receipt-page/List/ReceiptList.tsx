import React from 'react';
import { NormalizedReceipts, Receipt } from '../../../config/DomainTypes';
import { selectReceipt } from '../receiptActions';
import { useHistory } from 'react-router-dom';
import { StateContext } from '../../../rxjs-as-redux/storeInstances';
import cx from 'classnames';
import RoutedPage from '../../page-wrapper/RoutedPage';
import styles from './ReceiptList.module.css';
import RoundLinkCreateReceipt from '../../../components/RoundButton';

export const toNumber = (input: string | number): number => (typeof input === 'string') ? parseInt(input, 10) : input;

const receiptLine = (history: any, receipt: Receipt) => {
  const date = new Date(toNumber(receipt.buyDate || receipt.creationDate));
  return (
    <li
      key={receipt.id}
      className={cx(styles.lineGrid, styles.lineSelectEffect, styles.lineTriangleEffect)}
      onClick={() => redirectToReceipt(history, receipt.id)}>
      <div className={styles.dateColor}>{date.toLocaleDateString()}&emsp;{date.toLocaleTimeString()}</div>
      <span>Name:</span>
      <span>{receipt.itemName}</span>
      <span>Shop:</span>
      <span>{receipt.shopName}</span>
    </li>
  );
};

const ReceiptList = ({history, receipts }: { history: any, receipts: NormalizedReceipts }) => {
  return (
    <ul className={styles.receiptList}>
      {!!receipts.order.length && receipts.order.map(id => receiptLine(history, receipts.byId[id]))}
      {!receipts.order.length && <span>list is empty &ensp; : (</span>}
    </ul>
  );
};
const redirectToReceipt = (history: any, receiptId: string) => {
  history.push(`/receipt/${receiptId}`)
  selectReceipt(receiptId)
};

const ReceiptPage = () => {
  const history = useHistory();

  return (
    <StateContext.Consumer>
      {({ receipts, isLoading }) => (
        <RoutedPage pageTitle="Receipt list">
          {isLoading && <p>Loading...</p>}
          <ReceiptList receipts={receipts} history={history}/>
          <RoundLinkCreateReceipt />
        </RoutedPage>
      )}
    </StateContext.Consumer>
  );
};
export default ReceiptPage;
