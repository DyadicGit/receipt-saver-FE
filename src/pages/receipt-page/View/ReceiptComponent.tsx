import React, { useEffect, useState } from 'react';
import { Receipt } from '../../../config/DomainTypes';
import { createReceipt, editReceipt } from '../receiptActions';
import Field from '../../../components/InputField';
import { Mode } from './ReceiptContainer';
import { monthsToSeconds, secondsToMonths, toNumber } from '../utils';
import { Carousel, ImgContainer, UploadButton, XButton } from './ReceiptComponent.styles';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AttachmentFieldName } from '../../../config/endpoints';
import { ImageState } from '../../../rxjs-as-redux/storeInstances';
import LazyImage from '../../../components/LazyImage';

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

type ImageBoxProps = { onRemove: () => void; url: string; hideDeleteButton: boolean };
const ImageBox = ({ onRemove, url, hideDeleteButton }: ImageBoxProps) => {
  return (
    <ImgContainer>
      {!hideDeleteButton && <XButton onClick={onRemove}>X</XButton>}
      <LazyImage src={url} alt="image" />
    </ImgContainer>
  );
};
const toImageState = ({ file, result }: ReadResult): Observable<ImageState> => of({ key: undefined, file, url: result, userUploaded: true });

const stateFromReceipt = (receipt: Receipt) => ({
  itemName: (receipt && receipt.itemName) || '',
  shopName: (receipt && receipt.shopName) || '',
  date: new Date(toNumber((receipt && receipt.buyDate) || (receipt && receipt.creationDate)) || Date()).toISOString().substr(0, 10),
  totalPrice: (receipt && receipt.totalPrice) || 0,
  warrantyPeriod: secondsToMonths(receipt && receipt.warrantyPeriod) || 0
});
type ReceiptFormProps = {
  formId: string;
  loadedReceipt: Receipt;
  loadedImages: ImageState[];
  mode: Mode;
  setMode: (mode: Mode) => void;
};

type ReceiptFormState = {
  itemName: string;
  shopName: string;
  date: string;
  totalPrice: number;
  warrantyPeriod: number;
};
const ReceiptForm = ({ formId, loadedReceipt, loadedImages, mode, setMode }: ReceiptFormProps) => {
  const [state, setState] = useState<ReceiptFormState>(stateFromReceipt(loadedReceipt));
  useEffect(() => setState(stateFromReceipt(loadedReceipt)), [loadedReceipt]);

  const [images, setImages] = useState<ImageState[]>(loadedImages);
  useEffect(() => setImages(loadedImages), [loadedImages]);

  const handleSubmit = e => {
    e.preventDefault();
    // console.log([{ itemName }, { shopName }, { date }, { image }, { totalPrice }, { warrantyPeriod: monthsToSeconds(warrantyPeriod) }]);
    const formData = new FormData();
    const receiptData = {
      ...loadedReceipt,
      shopName: state.shopName,
      itemName: state.itemName,
      images: images.filter(s => !s.userUploaded),
      buyDate: Date.parse(`${state.date} ${new Date().getHours()}:${new Date().getMinutes()}`),
      totalPrice: state.totalPrice,
      warrantyPeriod: monthsToSeconds(state.warrantyPeriod)
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

  const handleImageDeletion = key => setImages(images.filter(img => img.key !== key));

  return (
    <form id={formId} onSubmit={handleSubmit}>
      {!!images.length && (
        <Carousel>
          {images.map((img, index) => (
            <ImageBox key={index} onRemove={() => handleImageDeletion(img.key)} url={img.url} hideDeleteButton={isDisabled[mode]} />
          ))}
        </Carousel>
      )}
      {mode !== 'VIEW' && (
        <UploadButton>
          <label htmlFor="imageUpload">Upload images</label>
          <input id="imageUpload" type="file" multiple accept="image/*" onChange={handleImageInput} disabled={isDisabled[mode]} />
        </UploadButton>
      )}
      <Field text="Item name" value={state.itemName} setter={value => setState({ ...state, itemName: value })} disabled={isDisabled[mode]} />
      <Field text="Shop" value={state.shopName} setter={value => setState({ ...state, shopName: value })} disabled={isDisabled[mode]} />
      <Field text="Date" value={state.date} setter={value => setState({ ...state, date: value })} type="date" disabled={isDisabled[mode]} />
      <Field text="Price" value={state.totalPrice} setter={value => setState({ ...state, totalPrice: value })} type="number" disabled={isDisabled[mode]} />
      <Field
        text="Warranty Period (in months)"
        value={state.warrantyPeriod}
        setter={value => setState({ ...state, warrantyPeriod: value })}
        type="number"
        disabled={isDisabled[mode]}
      />
    </form>
  );
};

export default ReceiptForm;
