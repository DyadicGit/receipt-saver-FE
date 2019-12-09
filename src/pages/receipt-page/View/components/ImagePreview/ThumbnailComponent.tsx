import { ResponsiveImageData } from '../../../../../config/DomainTypes';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Carousel, CircleSpinner, flexInitSizeFix, Img, ImgContainerWrapper as SmallContainer } from './ImagePreview.styles';
import { ImageStateList } from '../../ReceiptComponent';
import { InputButton } from '../../../../../components/ButtonBlackWhite';

const SmallCarousel = styled(Carousel)`
  height: 30vh;
`;

const Picture = styled.picture`
  ${flexInitSizeFix};
  flex-basis: 80%;
  flex-grow: 0;
  height: 100%;
`;

const gapBetweenButtons = '5px';
const UploadedImgThumbnailPreview = styled.img`
  ${flexInitSizeFix};
  flex-basis: 80%;
  flex-grow: 0;
  max-height: calc(80% - 2 * ${gapBetweenButtons});
`;
const XButton = styled(InputButton)`
  flex-basis: 10%;
  color: white;
  background-color: rgba(255, 0, 0, 0.4);
  margin-bottom: ${gapBetweenButtons};
  :hover,
  :active {
    color: white;
    background-color: red;
  }
`;

const DetectButton = styled(InputButton)`
  flex-basis: 10%;
  margin-top: ${gapBetweenButtons};
`;

const EmptySpace = styled.div`
  height: calc(10% + ${gapBetweenButtons});
`;

const mediaQueries = {
  px320: '(max-width: 600px)',
  px600: '(max-width: 900px)',
  px900: '(max-width: 1200px)',
  orig: '(min-width: 1200px)',
  current: () => Object.keys(mediaQueries).filter(key => window.matchMedia(mediaQueries[key]))[0]
};

const placeHolder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=';

type ImageBoxProps = {
  onRemove: () => void;
  onThumbnailClick: () => void;
  onDetectClick: () => void;
  base64: string | undefined;
  responsiveImageData: ResponsiveImageData | undefined;
  hideButtons: boolean;
};

const Thumbnail = ({ onRemove, onThumbnailClick, onDetectClick, base64, responsiveImageData, hideButtons }: ImageBoxProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const handleImageLoaded = () => {
    setLoading(false);
  };
  return (
    <SmallContainer>
      {!hideButtons && <XButton type="button" onClick={onRemove} value="x" />}
      {hideButtons && <EmptySpace />}
      {loading && <CircleSpinner />}
      {!responsiveImageData && <UploadedImgThumbnailPreview src={base64 || placeHolder} alt="user-uploaded" onLoad={handleImageLoaded} />}
      {!!responsiveImageData && (
        <Picture onLoad={handleImageLoaded}>
          <source media={mediaQueries.px320} srcSet={responsiveImageData.px320.url} />
          <source media={mediaQueries.px600} srcSet={responsiveImageData.px600.url} />
          <source media={mediaQueries.px900} srcSet={responsiveImageData.px900.url} />
          <source media={mediaQueries.orig} srcSet={responsiveImageData.orig.url} />
          <Img
            src={responsiveImageData.orig.url}
            alt={mediaQueries.current() ? responsiveImageData[mediaQueries.current()].url : 'image-download-name-absent'}
            onClick={onThumbnailClick}
          />
        </Picture>
      )}
      {!hideButtons && <DetectButton value="detect" type="button" onClick={onDetectClick} />}
    </SmallContainer>
  );
};
type Props = {
  images: ImageStateList;
  onRemoveClick: (uniqueId: string) => void;
  onThumbnailClick: (index) => void;
  onDetectClick: (imageState) => void;
  hideButtons: boolean;
};
export default ({ images, onRemoveClick, onThumbnailClick, onDetectClick, hideButtons }: Props) => (
  <SmallCarousel>
    {images.map((img, index) => (
      <Thumbnail
        key={index}
        onRemove={() => onRemoveClick(img.uniqueId)}
        onThumbnailClick={() => onThumbnailClick(index)}
        onDetectClick={() => onDetectClick(img)}
        responsiveImageData={img.responsiveImageData || undefined}
        base64={img.base64 || undefined}
        hideButtons={hideButtons}
      />
    ))}
  </SmallCarousel>
);
