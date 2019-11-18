import React, { useEffect, useState } from 'react';
import { ajax } from 'rxjs/ajax';
import { AttachmentFieldName, getImageByKeyApi, helloWorldApi, uploadImageApi } from '../config/endpoints';
import RoutedPage from './page-wrapper/RoutedPage';
import { toUrl } from '../config/utils';

type ImageResponse = { buffer: { type: string; data: Buffer }; contentType: string };

export default function HelloWorldPage() {
  const [text, setText] = useState('');
  useEffect(() => {
    fetch(helloWorldApi)
      .then(response => response.text())
      .then(setText);
  }, []);
  const [imageUrl, setImageUrl] = useState({ url: '', loading: false });
  const loadImage = () => {
    setImageUrl({ ...imageUrl, loading: true });
    fetch(getImageByKeyApi('pusheen-christmas-kawaii.jpg'))
      .then(response => response.json())
      .then((res: ImageResponse) => {
        setImageUrl({ url: toUrl(res.buffer.data, res.contentType), loading: false });
      });
  };
  const [files, setFiles] = useState([]);

  const handleUploadSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    for (const file of files) {
      formData.append(AttachmentFieldName.RECEIPT, file);
    }
    ajax.post(uploadImageApi, formData).subscribe(({ response }) => {
      // @ts-ignore
      loadImage(response.key[0])
    });
  };
  const handleInputChange = e => {
    const inputFiles = e.target.files;
    setFiles(files.concat(...inputFiles));
  };
  return (
    <RoutedPage pageTitle="Testing page">
      <h1>{text}</h1>
      <button onClick={loadImage}>load image</button>
      {!imageUrl.loading && imageUrl.url && <img alt="pusheen" src={imageUrl.url} />}
      {imageUrl.loading && <div>loading...</div>}
      <br />
      <br />
      <span>Image Upload</span>
      <form onSubmit={handleUploadSubmit}>
        <input type="file" multiple accept="image/*" onChange={handleInputChange} />
        <button type="submit" name="upload">
          Upload
        </button>
      </form>
    </RoutedPage>
  );
}
