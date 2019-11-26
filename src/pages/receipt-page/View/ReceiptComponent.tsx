import React, { useEffect, useState } from 'react';
import { Receipt } from '../../../config/DomainTypes';
import Field from '../../../components/InputField';
import { Mode } from './ReceiptContainer';
import { compressImage, monthsToSeconds, readFileAsBase64, ReadResult, secondsToMonths, toNumber } from '../utils';
import { Carousel, ImgContainer, UploadButton, XButton } from './ReceiptComponent.styles';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ImageState, SelectedReceiptState } from '../../../rxjs-as-redux/storeInstances';
import LazyImage from '../../../components/LazyImage';
import { setGlobalLoading } from "../receiptActions";

const isDisabled = { EDIT: false, VIEW: true, CREATE: false };

type ImageBoxProps = { onRemove: () => void; url: string; hideDeleteButton: boolean };
const ImageBox = ({ onRemove, url, hideDeleteButton }: ImageBoxProps) => {
  return (
    <ImgContainer>
      {!hideDeleteButton && (
        <XButton type="button" onClick={onRemove}>
          X
        </XButton>
      )}
      <LazyImage src={url} alt="image" />
    </ImgContainer>
  );
};
const toImageState = ({ file, result }: ReadResult): Observable<ImageState> => of({ key: file.name, file, url: result, userUploaded: true });

const stateFromReceipt = (receipt: Receipt | undefined) => ({
  id: (receipt && receipt.id) || '',
  itemName: (receipt && receipt.itemName) || '',
  shopName: (receipt && receipt.shopName) || '',
  date: new Date(receipt ? toNumber(receipt.buyDate || receipt.creationDate ) : Date()).toISOString().substr(0, 10),
  totalPrice: (receipt && receipt.totalPrice) || 0,
  warrantyPeriod: secondsToMonths(receipt && receipt.warrantyPeriod) || 0
});
type ReceiptFormProps = {
  formId: string;
  loadedReceipt: Receipt | undefined;
  selectedReceipt: SelectedReceiptState | null;
  mode: Mode;
  uploadSubmittedForm: (receipt: Receipt, userUploadedImages: File[]) => void;
};

type ReceiptFormState = {
  id: string;
  itemName: string;
  shopName: string;
  date: string;
  totalPrice: number;
  warrantyPeriod: number;
};
const ReceiptForm = ({ formId, loadedReceipt, selectedReceipt, mode, uploadSubmittedForm }: ReceiptFormProps) => {
  const [state, setState] = useState<ReceiptFormState>(stateFromReceipt(loadedReceipt));
  const [images, setImages] = useState<ImageState[]>((selectedReceipt && mode !== 'CREATE') ? selectedReceipt.images : []);
  useEffect(() => {
      if (selectedReceipt && loadedReceipt && loadedReceipt.id === selectedReceipt.id) {
        setImages(selectedReceipt.images);
        setState(stateFromReceipt(loadedReceipt));
      }
  }, [loadedReceipt, selectedReceipt]);



  const handleSubmit = e => {
    e.preventDefault();
    // console.log([{ itemName }, { shopName }, { date }, { image }, { totalPrice }, { warrantyPeriod: monthsToSeconds(warrantyPeriod) }]);

    const receipt = {
      ...(loadedReceipt || {}),
      shopName: state.shopName,
      itemName: state.itemName,
      images: images.filter(s => !s.userUploaded).map(s => s.key),
      buyDate: Date.parse(`${state.date} ${new Date().getHours()}:${new Date().getMinutes()}`),
      totalPrice: state.totalPrice,
      warrantyPeriod: monthsToSeconds(state.warrantyPeriod)
    };
    const imageFiles = images.filter(s => s.userUploaded).map(s => s.file) as File[];
    uploadSubmittedForm(receipt as any, imageFiles);
  };

  const handleImageInput = e => {
    const files: File[] = Array.from(e.target.files);
    if (files.length) {
      setGlobalLoading(true);
      forkJoin(
        files.map(file =>
          compressImage(file).pipe(
            switchMap(readFileAsBase64),
            switchMap(toImageState)
          )
        )
      ).subscribe(
        newImages => {
          setImages((images) => [...images, ...newImages]);
          setGlobalLoading(false);
        },
        error => {
          console.error(error);
          setGlobalLoading(false);
        }
      );
    }
  };

  const handleImageDeletion = key => {
    setImages(images.filter(img => img.key !== key));
  };

  return (
    <form id={formId} onSubmit={handleSubmit} autoComplete="off">
      {!!images && !!images.length && (
        <Carousel>
          {images.map((img, index) => (
            <ImageBox key={index} onRemove={() => handleImageDeletion(img.key)} url={img.url} hideDeleteButton={isDisabled[mode]} />
          ))}
        </Carousel>
      )}
      {mode !== 'VIEW' && (
        <UploadButton>
          <label htmlFor="imageUpload">select images</label>
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
