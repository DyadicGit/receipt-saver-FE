import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { StateContext } from '../../../rxjs-as-redux/storeInstances';
import { Receipt } from '../../../config/DomainTypes';
import RoutedPage from '../../page-wrapper/RoutedPage';
import ReceiptForm from './ReceiptComponent';

export type Mode = 'EDIT' | 'VIEW' | 'CREATE';

const ReceiptContainer = ({ initMode }: { initMode?: Mode }) => {
  const [mode, setMode]: [Mode, any] = useState(initMode || 'VIEW');
  const [pageTitle, setPageTitle] = useState('Receipt Info');
  const fromParams = useParams();
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

  return (
    <StateContext.Consumer>
      {({ receipts, selectedReceipt }) => {
        const receipt: Receipt | undefined = mode !== 'CREATE' ? receipts.byId[(selectedReceipt || fromParams).id] : undefined;

        return (
          <>
            {(receipt || mode === 'CREATE') && (
              <RoutedPage pageTitle={pageTitle}>
                <ReceiptForm receipt={receipt as any} mode={mode} onEditClick={setModeAndPageTitle} />
              </RoutedPage>
            )}
          </>
        );
      }}
    </StateContext.Consumer>
  );
};

export default ReceiptContainer;
