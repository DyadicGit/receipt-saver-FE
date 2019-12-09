import React from 'react';
import styled from 'styled-components';
import { ImageState, toUploadedImages } from '../ReceiptComponent';
import { detectUploaded } from '../../receiptActions';
import { bodyHeight, bodyHeightLandscape, bodyWidth, navBarHeight, navBarHeightLandscape } from '../../../page-wrapper/RoutedPage.styles';
import ButtonBlackWhite from '../../../../components/ButtonBlackWhite';
import FullPageDimmer from '../../../../components/FullPageDimmer';

const zIndexDimmer = 1;
const zIndexModal = 2;
const Container = styled.div`
  z-index: ${zIndexModal};
  background-color: black;
  position: absolute;
  top: ${navBarHeight};
  height: calc(${bodyHeight} - 1vh);
  left: 1vw;
  width: 98vw;
  @media screen and (orientation: landscape) {
    height: calc(${bodyHeightLandscape} - 1vh);
    top: ${navBarHeightLandscape};
  }
`;

type Props = { imageState: ImageState; onDismiss: () => void };
export default ({ imageState, onDismiss }: Props) => {
  const sendImageToServer = () => {
    if (imageState.userUploaded && imageState.base64) {
      detectUploaded(toUploadedImages(imageState));
    } else {
      console.log('not yet implemented');
    }
  };

  return (
    <>
      <Container>
        <ButtonBlackWhite type="button" value="Close" onClick={onDismiss} />
        <div>{imageState.uniqueId}</div>
      </Container>
      <FullPageDimmer zIndex={zIndexDimmer} />
    </>
  );
};
