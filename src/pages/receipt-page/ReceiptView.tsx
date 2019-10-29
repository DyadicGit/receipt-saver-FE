import React from 'react';
import { StateContext } from '../../rxjs-as-redux/storeInstances';
import { Receipt } from '../../config/DomainTypes';
import { useParams } from 'react-router-dom';
import RoutedPage from '../page-wrapper/RoutedPage';

const ReceiptView = () => {
  const fromParams = useParams();
  return (
    <StateContext.Consumer>
      {({ receipts, isLoading, selectedReceipt }) => {
        const receipt: Receipt | undefined = receipts.find(r => r.id === (selectedReceipt || fromParams).id);
        return (
          <>
            {receipt && (
              <RoutedPage pageTitle="Receipt Info" background="rgb(41, 34, 51)">
                <div className="receipt-view">
                  <p>{receipt.itemName}</p>
                  <p>{receipt.shopName}</p>
                  <p>{receipt.creationDate}</p>
                </div>
              </RoutedPage>
            )}
          </>
        );
      }}
    </StateContext.Consumer>
  );
};

export default ReceiptView;
