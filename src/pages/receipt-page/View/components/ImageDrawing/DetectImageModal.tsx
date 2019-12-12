import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ImageState, toUploadedImages } from '../../ReceiptComponent';
import { detectUploaded } from '../../../receiptActions';
import { bodyHeight, bodyHeightLandscape, navBarHeight, navBarHeightLandscape } from '../../../../page-wrapper/RoutedPage.styles';
import { InputButton } from '../../../../../components/ButtonBlackWhite';
import FullPageDimmer from '../../../../../components/FullPageDimmer';
import addDrawingTools from './canvasDrawingTools';
import colorUtils, { Color } from './colorUtils';

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
  width: 50%;
`;
const ConfirmButton = styled(InputButton)`
  height: 40px;
  width: 50%;
`;

const Img = styled.img`
  width: 100%;
`;
const WorkspaceContainer = styled.div`
  position: relative;
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
`;

const BrushColor: Color = { R: 255, G: 255, B: 0, alpha: 0.1 };
const defaultMimeType = 'image/png';

type Props = { imageState: ImageState; onDismiss: () => void };
export default ({ imageState, onDismiss }: Props) => {
  const [canvasSize, setCanvasSize] = useState<{ height: number; width: number } | null>(null);
  const [ctx, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const onImageSet = useCallback((e) => {
    if (e.target) {
      const height = e.target.offsetHeight - 1;
      const width = e.target.offsetWidth - 1;
      setCanvasSize({ height, width });
    }
  }, []);
  const onCanvasSet = useCallback(
    (ref: HTMLCanvasElement) => {
      if (ref && canvasSize && Object.getOwnPropertyNames(canvasSize).length) {
        ref.setAttribute('height', canvasSize.height.toString());
        ref.setAttribute('width', canvasSize.width.toString());
        setContext(ref.getContext('2d'));
        setCanvas(ref);
      }
    },
    [canvasSize]
  );

  const sendImageForDetection = croppedImage => {
    if (imageState.userUploaded && imageState.base64) {
      detectUploaded(toUploadedImages(imageState));
    } else {
      detectUploaded({ base64: croppedImage, contentType: defaultMimeType });
    }
  };

  const handleConfirm = () => {
    if (ctx && canvasSize && Object.getOwnPropertyNames(canvasSize) && imageState && imageState.responsiveImageData && canvas) {
      const canvasLayer: ImageData = ctx.getImageData(0, 0, canvasSize.width, canvasSize.height);
      const layerWithRemovedOpacity = colorUtils.replaceColor(canvasLayer, BrushColor, colorUtils.color.black);
      const bottomLayer = new Image();
      bottomLayer.onload = () => {
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.putImageData(layerWithRemovedOpacity, 0, 0);
        ctx.globalCompositeOperation = 'source-in';
        ctx.drawImage(bottomLayer, 0, 0, canvasSize.width, canvasSize.height);
        const resultOfCroppedCanvas = canvas.toDataURL(defaultMimeType);
        sendImageForDetection(resultOfCroppedCanvas);
      };
      bottomLayer.crossOrigin = 'Anonymous';
      bottomLayer.src = imageState.responsiveImageData.orig.url;
    }
  };

  useEffect(() => {
    if (ctx && canvas) {
      const colour = `rgba(${BrushColor.R}, ${BrushColor.G}, ${BrushColor.B}, ${BrushColor.alpha})`;
      const opacity = BrushColor.alpha;
      addDrawingTools(canvas, ctx, colour, 30, opacity);
    }
  }, [ctx, canvas, canvasSize]);
  return (
    <>
      <Container>
        <CloseButton type="button" value="Close" onClick={onDismiss} />
        <ConfirmButton type="button" value="Confirm" onClick={handleConfirm} />
        {imageState && imageState.responsiveImageData && (
          <WorkspaceContainer>
            <Img
              onLoad={onImageSet}
              src={imageState.responsiveImageData.orig.url}
              alt={imageState.responsiveImageData.orig.key}
            />
            <Canvas ref={onCanvasSet} />
          </WorkspaceContainer>
        )}
      </Container>
      <FullPageDimmer zIndex={zIndexDimmer} />
    </>
  );
};
