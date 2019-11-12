import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { GlobalState, Receipt } from '../../../config/DomainTypes';
import RoutedPage from '../../page-wrapper/RoutedPage';
import ReceiptForm from './ReceiptComponent';
import DeletionConfirmModal from './ConfirmationModal';
import { deleteReceipt } from '../receiptActions';

export type Mode = 'EDIT' | 'VIEW' | 'CREATE';

const titleByMode = (mode: Mode): string => ({
  EDIT: 'Editing',
  VIEW: 'Details',
  CREATE: 'Creation'
})[mode] || 'Details';

const ReceiptContainer = ({ state, initMode }: { state: GlobalState; initMode?: Mode }) => {
  const { receipts, selectedReceipt, isLoading } = state;

  const [mode, setMode]: [Mode, any] = useState(initMode || 'VIEW');
  const [showConf, setShowConf] = useState(false);
  const fromParams = useParams();
  const history = useHistory();
  const handleConfirmedDelete = receiptId => {
    history.push(`/receipt`);
    deleteReceipt(receiptId);
  };
  const receipt: Receipt | undefined = mode !== 'CREATE' ? receipts.byId[(selectedReceipt || fromParams).id] : undefined;
  return (
    <>
      {(receipt || mode === 'CREATE' || (mode === 'VIEW' && isLoading)) && (
        <RoutedPage pageTitle={titleByMode(mode)}>
          <ReceiptForm receipt={receipt as any} mode={mode} onEditClick={setMode} onDeleteClick={() => setShowConf(true)} />
        </RoutedPage>
      )}
      {receipt && mode === 'VIEW' && (
        <DeletionConfirmModal show={showConf} onConfirm={() => handleConfirmedDelete(receipt.id)} onDismiss={() => setShowConf(false)} />
      )}
    </>
  );
};

export default ReceiptContainer;
