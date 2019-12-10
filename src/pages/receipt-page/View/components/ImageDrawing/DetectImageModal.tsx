import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ImageState, toUploadedImages } from '../../ReceiptComponent';
import { detectUploaded } from '../../../receiptActions';
import { bodyHeight, bodyHeightLandscape, navBarHeight, navBarHeightLandscape } from '../../../../page-wrapper/RoutedPage.styles';
import { InputButton } from '../../../../../components/ButtonBlackWhite';
import FullPageDimmer from '../../../../../components/FullPageDimmer';

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

const CloseButton = styled(InputButton)`
  height: 40px;
  width: 100%;
`;
const CanvasContainer = styled.div`
  width: 100%;
  height: 92%;
  background-color: #3e3e3e;
`;

type Props = { imageState: ImageState; onDismiss: () => void };
export default ({ imageState, onDismiss }: Props) => {
  const [canvasSize, setCanvasSize] = useState<{ height: number; width: number } | null>(null);
  const [ctx, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const onContainerSet = useCallback((ref: HTMLDivElement) => {
    if (ref) {
      const height = ref.offsetHeight - 1;
      const width = ref.offsetWidth - 1;
      setCanvasSize({ height, width });
    }
  }, []);
  const onCanvasSet = useCallback((ref: HTMLCanvasElement) => {
    if (ref && canvasSize && Object.getOwnPropertyNames(canvasSize).length) {
      ref.setAttribute('height', canvasSize.height.toString());
      ref.setAttribute('width', canvasSize.width.toString());
      setContext(ref.getContext('2d'));
      setCanvas(ref);
    }
  }, [canvasSize]);

  useEffect(() => {
    if (canvas) {
      canvas.onmousedown = e => {
        var mouseX = e.pageX;
        var mouseY = e.pageY;
        console.log({ mouseX, mouseY });
      };
    }
  }, [canvas]);

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
        <CloseButton type="button" value="Close" onClick={onDismiss} />
        <CanvasContainer ref={onContainerSet}>
          <canvas ref={onCanvasSet}/>
        </CanvasContainer>
      </Container>
      <FullPageDimmer zIndex={zIndexDimmer} />
    </>
  );
};
