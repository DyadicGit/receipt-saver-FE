import React from 'react';
import { NormalizedReceipts, Receipt } from '../../../config/DomainTypes';
import { selectReceipt } from '../receiptActions';
import { useHistory } from 'react-router-dom';
import { StateContext } from '../../../rxjs-as-redux/storeInstances';
import cx from 'classnames';
import RoutedPage from '../../page-wrapper/RoutedPage';
import styles from './ReceiptList.module.css';
import RoundLinkCreateReceipt from '../../../components/RoundButton';
import { secondsToMonths, toNumber } from "../utils";

const warrantyTimer = (buyDate: Date, warrantyPeriod: number = 0) => {
  const warrantyEndDate = new Date(buyDate).setMonth(buyDate.getMonth() + secondsToMonths(warrantyPeriod));
  const difference = warrantyEndDate - Date.now();
  const days = Math.floor(difference/1000/60/60/24);
  return days <= 0 ? '\u2014' : (days >= 30 ? `${Math.floor(days/30)} months left,` : `${days} days left,`);
};

const receiptLine = (history: any, receipt: Receipt) => {
  const date = new Date(toNumber(receipt.buyDate || receipt.creationDate));
  return (
    <li
      key={receipt.id}
      className={cx(styles.lineGrid, styles.lineSelectEffect, styles.lineTriangleEffect)}
      onClick={() => redirectToReceipt(history, receipt.id)}>
      <div className={styles.dateColor}>{warrantyTimer(date, receipt.warrantyPeriod)}&emsp;{date.toLocaleDateString()}&nbsp;{date.toLocaleTimeString()}</div>
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
