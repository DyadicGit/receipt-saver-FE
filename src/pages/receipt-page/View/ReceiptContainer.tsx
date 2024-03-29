import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Hammer from 'hammerjs';
import { GlobalState, Receipt, UploadedImagesList } from '../../../config/DomainTypes';
import RoutedPage from '../../page-wrapper/RoutedPage';
import ReceiptForm from './ReceiptComponent';
import DeletionConfirmModal from './components/ConfirmationModal';
import {
  createReceipt,
  deleteReceipt,
  dispatchSeriousError,
  editReceipt,
  selectReceiptAndFetchItsImages
} from '../receiptActions';
import ButtonBlackWhite from '../../../components/ButtonBlackWhite';
import { fromEvent, Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

export type Mode = 'EDIT' | 'VIEW' | 'CREATE';
let swipeListener$ = new Subject();
swipeListener$.pipe(throttleTime(500)).subscribe((fn: any) => fn());
const swipeAction = (event, history) => () => {
  // console.log(event.type + ' gesture detected.');
  history.push(`/receipt`);
};

const titleByMode = (mode: Mode): string =>
  ({
    EDIT: 'Editing',
    VIEW: 'Details',
    CREATE: 'Creation'
  }[mode] || 'Details');

const ReceiptContainer = ({ state: { isLoading, receipts, selectedReceipt }, initMode }: { state: GlobalState; initMode?: Mode }) => {
  const [mode, setMode]: [Mode, any] = useState(initMode || 'VIEW');
  const [showConf, setShowConf] = useState(false);
  const fromParams = useParams(),
    fromParamsId = fromParams.id;
  const receipt: Receipt | undefined = mode !== 'CREATE' ? receipts && receipts.byId[fromParamsId] : undefined;
  useEffect(() => {
    if (fromParamsId && receipt) {
      selectReceiptAndFetchItsImages(fromParamsId);
    }
    if (fromParamsId && !receipt) {
      dispatchSeriousError();
    }
  }, [fromParamsId, receipt]);
  const history = useHistory();
  const handleConfirmedDelete = receiptId => {
    history.push(`/receipt`);
    deleteReceipt(receiptId);
  };
  const refForSwipeBack: any = useRef(null);
  useEffect(() => {
    if (refForSwipeBack && refForSwipeBack.current) {
      const mc = new Hammer(refForSwipeBack.current, { recognizers: [[Hammer.Swipe, { direction: Hammer.DIRECTION_HORIZONTAL }]] });
      fromEvent(mc as any, 'swiperight').subscribe(event => {
        swipeListener$.next(swipeAction(event, history));
      });
    }
  });

  const formId = (receipt && receipt.id) || 'create';

  const uploadSubmittedForm = (receipt: Receipt, userUploadedImages: UploadedImagesList) => {
    if (mode === 'EDIT') {
      editReceipt(receipt, userUploadedImages);
      setMode('VIEW');
    }
    if (mode === 'CREATE') {
      createReceipt(receipt, userUploadedImages);
      history.push('/receipt');
    }
  };

  return (
    <>
      {(receipt || mode === 'CREATE' || (mode === 'VIEW' && isLoading)) && (
        <RoutedPage
          pageTitle={titleByMode(mode)}
          buttons={[
            (mode === 'EDIT' || mode === 'CREATE') && <ButtonBlackWhite form={formId} type="submit" value="Submit" />,
            mode === 'VIEW' && <ButtonBlackWhite type="button" value="Edit" onClick={() => setMode('EDIT')} />,
            mode === 'VIEW' && <ButtonBlackWhite red type="button" value="Delete" style={{ float: 'right' }} onClick={() => setShowConf(true)} />
          ]}
          refBody={refForSwipeBack}
        >
          <ReceiptForm
            formId={formId}
            loadedReceipt={receipt as any}
            selectedReceipt={selectedReceipt}
            mode={mode}
            uploadSubmittedForm={uploadSubmittedForm}
          />
        </RoutedPage>
      )}
      {receipt && mode === 'VIEW' && (
        <DeletionConfirmModal show={showConf} onConfirm={() => handleConfirmedDelete(receipt.id)} onDismiss={() => setShowConf(false)} />
      )}
    </>
  );
};

export default ReceiptContainer;
