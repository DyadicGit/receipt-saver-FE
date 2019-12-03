import React, { useEffect, useState } from 'react';
import { Receipt, ResponsiveImageData, UploadedImagesList } from '../../../config/DomainTypes';
import Field from '../../../components/InputField';
import { Mode } from './ReceiptContainer';
import { compressImage, monthsToSeconds, readFileAsBase64, ReadResult, secondsToMonths, toNumber } from '../utils';
import { UploadButton } from './ReceiptComponent.styles';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SelectedReceiptState } from '../../../rxjs-as-redux/storeInstances';
import { setGlobalLoading } from '../receiptActions';
import ThumbnailPreview from './components/ImagePreview/ThumbnailComponent';
import ImageFullScreenPreview from './components/ImagePreview/FullScreenComponent';

const isDisabled = { EDIT: false, VIEW: true, CREATE: false };
const toImageState = ({ file, result }: ReadResult): Observable<ImageState> =>
  of({ uniqueId: file.name, base64: result, userUploaded: true, responsiveImageData: undefined, file } as ImageState);
const toImageStateFromImageData = (i: ResponsiveImageData): ImageState => ({ responsiveImageData: i, uniqueId: i.orig.key, userUploaded: false });

const stateFromReceipt = (receipt: Receipt | undefined) => ({
  id: (receipt && receipt.id) || '',
  itemName: (receipt && receipt.itemName) || '',
  shopName: (receipt && receipt.shopName) || '',
  date: new Date(receipt ? toNumber(receipt.buyDate || receipt.creationDate) : Date()).toISOString().substr(0, 10),
  totalPrice: (receipt && receipt.totalPrice) || 0,
  warrantyPeriod: secondsToMonths(receipt && receipt.warrantyPeriod) || 0
});

type ReceiptFormProps = {
  formId: string;
  loadedReceipt: Receipt | undefined;
  selectedReceipt: SelectedReceiptState;
  mode: Mode;
  uploadSubmittedForm: (receipt: Receipt, userUploadedImages: UploadedImagesList) => void;
};
type ReceiptFormState = {
  id: string;
  itemName: string;
  shopName: string;
  date: string;
  totalPrice: number;
  warrantyPeriod: number;
};
type ImageState = {
  uniqueId: string;
  responsiveImageData?: ResponsiveImageData;
  userUploaded: boolean;
  base64?: string;
  file?: File;
};
export type ImageStateList = ImageState[];

const ReceiptForm = ({ formId, loadedReceipt, selectedReceipt, mode, uploadSubmittedForm }: ReceiptFormProps) => {
  const [state, setState] = useState<ReceiptFormState>(stateFromReceipt(loadedReceipt));
  const [images, setImages] = useState<ImageStateList>([]);
  const [showFullScreen, setShowFullScreen] = useState<boolean>(false);
  const [imageIndex, setImageIndex] = useState<number>(0);
  useEffect(() => {
    if (selectedReceipt && loadedReceipt && loadedReceipt.id === selectedReceipt.id) {
      setImages(selectedReceipt.images.map(toImageStateFromImageData));
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
      images: images.filter(s => !s.userUploaded).map(s => s.responsiveImageData),
      buyDate: Date.parse(`${state.date} ${new Date().getHours()}:${new Date().getMinutes()}`),
      totalPrice: state.totalPrice,
      warrantyPeriod: monthsToSeconds(state.warrantyPeriod)
    };
    const uploadedImages: UploadedImagesList = images
      .filter(i => i.userUploaded)
      .map(({ base64, file }: any) => ({
        base64: base64,
        contentType: file.type
      }));
    uploadSubmittedForm(receipt as any, uploadedImages);
  };

  const handleImageInput = e => {
    const files: File[] = Array.from(e.target.files);
    if (files.length) {
      setGlobalLoading(true);
      const compressReadMapToState$ = forkJoin(
        files.map(file =>
          compressImage(file).pipe(
            switchMap(readFileAsBase64),
            switchMap(toImageState)
          )
        )
      );
      compressReadMapToState$.subscribe(
        newImages => {
          setImages(images => [...images, ...newImages]);
          setGlobalLoading(false);
        },
        error => {
          console.error(error);
          setGlobalLoading(false);
        }
      );
    }
  };
  const showFullScreenAndScrollToImage = index => {
    setShowFullScreen(true);
    setImageIndex(index);
  };
  const handleImageDeletion = uniqueId => {
    setImages(images.filter(img => img.uniqueId !== uniqueId));
  };
  return (
    <form id={formId} onSubmit={handleSubmit} autoComplete="off">
      {!showFullScreen && !!images && !!images.length && (
        <ThumbnailPreview
          onRemoveClick={handleImageDeletion}
          onThumbnailClick={showFullScreenAndScrollToImage}
          images={images}
          hideDeleteButton={isDisabled[mode]}
        />
      )}
      {showFullScreen && selectedReceipt && selectedReceipt.images && (
        <ImageFullScreenPreview images={selectedReceipt.images} onExit={() => setShowFullScreen(false)} imageIndex={imageIndex} />
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
