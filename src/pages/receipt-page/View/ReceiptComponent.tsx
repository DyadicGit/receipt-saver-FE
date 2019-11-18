import React, { useState } from 'react';
import { Receipt } from '../../../config/DomainTypes';
import { createReceipt, editReceipt } from '../receiptActions';
import Field from '../../../components/InputField';
import { Mode } from './ReceiptContainer';
import { monthsToSeconds, secondsToMonths, toNumber } from '../utils';
import { Carousel, Img, UploadButton } from './ReceiptComponent.styles';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AttachmentFieldName } from "../../../config/endpoints";

const isDisabled = { EDIT: false, VIEW: true, CREATE: false };
type ReadResult = { file: File; result: string };
const readFile = (file: File): Observable<ReadResult> =>
  new Observable(obs => {
    if (!(file instanceof File)) {
      obs.error(new Error('`file` must be an instance of File.'));
      return;
    }
    const reader = new FileReader();

    reader.onerror = err => obs.error(err);
    reader.onabort = err => obs.error(err);
    reader.onload = () => obs.next({ file, result: reader.result as string });
    reader.onloadend = () => obs.complete();

    return reader.readAsDataURL(file);
  });

type ReceiptFormProps = {
  formId: string;
  receipt: Receipt;
  mode: Mode;
  setMode: (mode: Mode) => void;
};

type ImageState = { key: string | undefined; preview: string; file: File | undefined };
const toImageState = ({ file, result: preview }: ReadResult): Observable<ImageState> => of({ key: undefined, file, preview });

const ReceiptForm = ({ formId, receipt, mode, setMode }: ReceiptFormProps) => {
  const [itemName, setItemName] = useState((receipt && receipt.itemName) || '');
  const [shopName, setShopName] = useState((receipt && receipt.shopName) || '');
  const [date, setDate] = useState(
    new Date(toNumber((receipt && receipt.buyDate) || (receipt && receipt.creationDate)) || Date()).toISOString().substr(0, 10)
  );
  const [images, setImages]: [ImageState[], any] = useState<ImageState[]>([]);
  const [totalPrice, setTotalPrice] = useState((receipt && receipt.totalPrice) || 0);
  const [warrantyPeriod, setWarrantyPeriod] = useState(secondsToMonths(receipt && receipt.warrantyPeriod) || 0);

  const handleSubmit = e => {
    e.preventDefault();
    // console.log([{ itemName }, { shopName }, { date }, { image }, { totalPrice }, { warrantyPeriod: monthsToSeconds(warrantyPeriod) }]);
    const formData = new FormData();
    const receiptData = {
      ...receipt,
      shopName,
      itemName,
      buyDate: Date.parse(`${date} ${new Date().getHours()}:${new Date().getMinutes()}`),
      totalPrice,
      warrantyPeriod: monthsToSeconds(warrantyPeriod)
    };
    Object.keys(receiptData).forEach(key => formData.set(key, receiptData[key]));
    images.forEach(image => formData.append(AttachmentFieldName.RECEIPT, image.file as any));

    if (mode === 'EDIT') editReceipt(formData);
    if (mode === 'CREATE') createReceipt(formData);
    setMode('VIEW');
  };
  const handleImageInput = e => {
    const files: File[] = Array.from(e.target.files);
    forkJoin(files.map(file => readFile(file).pipe(switchMap(toImageState)))).subscribe(
      newImages => setImages([...images, ...newImages]),
      error => console.error(error)
    );
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <Field text="Item name" value={itemName} setter={setItemName} disabled={isDisabled[mode]} />
      <Field text="Shop" value={shopName} setter={setShopName} disabled={isDisabled[mode]} />
      <Field text="Date" value={date} setter={setDate} type="date" disabled={isDisabled[mode]} />
      <UploadButton disabled={isDisabled[mode]}>
          <label htmlFor="imageUpload">Upload images</label>
          <input id="imageUpload" type="file" multiple accept="image/*" onChange={handleImageInput} disabled={isDisabled[mode]} />
      </UploadButton>
      <Carousel empty={!images.length}>{!!images.length && images.map((img, i) => <Img key={i} src={img.preview} />)}</Carousel>
      <Field text="Price" value={totalPrice} setter={setTotalPrice} type="number" disabled={isDisabled[mode]} />
      <Field text="Warranty Period (in months)" value={warrantyPeriod} setter={setWarrantyPeriod} type="number" disabled={isDisabled[mode]} />
    </form>
  );
};

export default ReceiptForm;
