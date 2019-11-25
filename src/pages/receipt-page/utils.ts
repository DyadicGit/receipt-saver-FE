import { Observable } from 'rxjs';
import Compressor from 'compressorjs';

export const toNumber = (input: string | number): number => (typeof input === 'string' ? parseInt(input, 10) : input);
export const monthsToSeconds = months => toNumber(months) * 12 * 24 * 60 * 60;
export const secondsToMonths = seconds => toNumber(seconds) / 12 / 24 / 60 / 60;

export type ReadResult = { file: File; result: string };
export const readFileAsBase64 = (file): Observable<ReadResult> =>
  new Observable(obs => {
    if (!(file instanceof File) && !(file instanceof Blob)) {
      obs.error(new Error('`file` must be an instance of File.'));
      return;
    }
    const reader = new FileReader();

    reader.onerror = err => obs.error(err);
    reader.onabort = err => obs.error(err);
    reader.onload = () => obs.next({ file: file as File, result: reader.result as string });
    reader.onloadend = () => obs.complete();

    reader.readAsDataURL(file);
  });

const COMPRESSION_QUALITY = 0.6;
export const compressImage = (file): Observable<File> => {
  return new Observable(obs => {
    if (!(file instanceof File)) {
      obs.error(new Error('`file` must be an instance of File.'));
      return;
    }
    const onSuccess = compressedFile => {
      obs.next(compressedFile);
      obs.complete();
    };
    const onError = error => obs.error(error);

    new Compressor(file, {
      quality: COMPRESSION_QUALITY,
      success: onSuccess,
      error: onError
    });
  });
};
