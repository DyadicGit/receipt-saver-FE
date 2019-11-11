import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { StateContext } from '../../../rxjs-as-redux/storeInstances';
import { Receipt } from '../../../config/DomainTypes';
import RoutedPage from '../../page-wrapper/RoutedPage';
import ReceiptForm from './ReceiptComponent';
import DeletionConfirmModal from './ConfirmationModal';
import { deleteReceipt } from '../receiptActions';

export type Mode = 'EDIT' | 'VIEW' | 'CREATE';

const ReceiptContainer = ({ initMode }: { initMode?: Mode }) => {
  const [mode, setMode]: [Mode, any] = useState(initMode || 'VIEW');
  const [pageTitle, setPageTitle] = useState('Receipt Info');
  const [showConf, setShowConf] = useState(false);
  const fromParams = useParams();
  const history = useHistory();

  const setModeAndPageTitle = (mode: Mode) => {
    if (mode === 'EDIT') {
      setMode('EDIT');
      setPageTitle('Receipt Edit');
    } else if (mode === 'VIEW') {
      setMode('VIEW');
      setPageTitle('Receipt Info');
    } else if (mode === 'CREATE') {
      setMode('CREATE');
      setPageTitle('Receipt Creation');
    } else {
      setMode('VIEW');
      setPageTitle('Receipt Info');
    }
  };
  const handleConfirmedDelete = receiptId => {
    history.push(`/receipt`);
    deleteReceipt(receiptId);
  };

  return (
    <StateContext.Consumer>
      {({ receipts, selectedReceipt, isLoading }) => {
        const receipt: Receipt | undefined = mode !== 'CREATE' ? receipts.byId[(selectedReceipt || fromParams).id] : undefined;
        return (
          <>
            {(receipt || mode === 'CREATE' || (mode === 'VIEW' && isLoading)) && (
              <RoutedPage pageTitle={pageTitle}>
                <ReceiptForm receipt={receipt as any} mode={mode} onEditClick={setModeAndPageTitle} onDeleteClick={() => setShowConf(true)} />
              </RoutedPage>
            )}
            {(receipt && mode === 'VIEW') && <DeletionConfirmModal show={showConf} onConfirm={() => handleConfirmedDelete(receipt.id)} onDismiss={() => setShowConf(false)} />}
          </>
        );
      }}
    </StateContext.Consumer>
  );
};

export default ReceiptContainer;
