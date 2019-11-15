import React, { useEffect, useRef } from 'react';
import { GlobalState, Receipt } from '../../../config/DomainTypes';
import { selectReceipt } from '../receiptActions';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';
import RoutedPage from '../../page-wrapper/RoutedPage';
import { secondsToMonths, toNumber } from '../utils';
import LinkBlackWhite from '../../../components/LinkBlackWhite';
import { Line, List, YellowDate } from './ReceiptList.styles';

const warrantyTimer = (buyDate: Date, warrantyPeriod: number = 0) => {
  const warrantyEndDate = new Date(buyDate).setMonth(buyDate.getMonth() + secondsToMonths(warrantyPeriod));
  const difference = warrantyEndDate - Date.now();
  const days = Math.floor(difference / 1000 / 60 / 60 / 24);
  return days <= 0 ? '\u2014' : days >= 30 ? `${Math.floor(days / 30)} months left,` : `${days} days left,`;
};

const receiptLine = (history: any, receipt: Receipt, selectedReceipt) => {
  const date = new Date(toNumber(receipt.buyDate || receipt.creationDate));
  const visited: boolean = selectedReceipt && receipt.id === selectedReceipt;
  return (
    <Line visited={visited} className={cx('selectEffect', 'triangleEffect')} key={receipt.id} onClick={() => redirectToReceipt(history, receipt.id)}>
      <YellowDate>
        {warrantyTimer(date, receipt.warrantyPeriod)}&emsp;{date.toLocaleDateString()}
      </YellowDate>
      <span>Name:</span>
      <span>{receipt.itemName}</span>
      <span>Shop:</span>
      <span>{receipt.shopName}</span>
    </Line>
  );
};

const redirectToReceipt = (history: any, receiptId: string) => {
  history.push(`/receipt/${receiptId}`);
  selectReceipt(receiptId);
};

export default ({ state: { receipts, selectedReceipt } }: { state: GlobalState }) => {
  const history = useHistory();
  const refPage: any = useRef(null);
  useEffect(() => {
    if (refPage && refPage.current) {
      const partial = receipts.order.findIndex(rId => rId === selectedReceipt) / receipts.order.length;
      refPage.current.scrollTo(0, refPage.current.scrollHeight * partial);
    }
  }, [selectedReceipt, receipts]);
  return (
    <RoutedPage pageTitle="Receipt list" buttons={[<LinkBlackWhite title="New" to="/receipt/create" />]} refPage={refPage}>
      <List>
        {receipts.order && !!receipts.order.length && receipts.order.map(id => receiptLine(history, receipts.byId[id], selectedReceipt))}
        {receipts.order && !receipts.order.length && <span>list is empty &ensp; : (</span>}
      </List>
    </RoutedPage>
  );
};
