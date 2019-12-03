import { ResponsiveImageData } from '../../../../../config/DomainTypes';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Carousel, CircleSpinner, Img, ImgContainer, imgContainerSidePadding } from './ImagePreview.styles';
import { ImageStateList } from '../../ReceiptComponent';

export const SmallCarousel = styled(Carousel)`
  height: 30vh;
`;

const ThumbnailPreview = styled(Img)`
  height: 100%;
`;

const XButton = styled.button`
  position: absolute;
  top: 5px;
  width: calc(100% - 2 * ${imgContainerSidePadding});
  display: inline-block;
  padding: 10px 2vw;
  border: 0.1em solid white;
  border-radius: 0.12em;
  box-sizing: border-box;
  text-decoration: none;
  font-weight: bold;
  text-align: center;
  transition: all 0.2s;
  color: white;
  background-color: rgba(255, 0, 0, 0.4);
  :hover,
  :active {
    background-color: red;
  }
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
  base64: string | undefined;
  responsiveImageData: ResponsiveImageData | undefined;
  hideDeleteButton: boolean;
};

const Thumbnail = ({ onRemove, onThumbnailClick, base64, responsiveImageData, hideDeleteButton }: ImageBoxProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const handleImageLoaded = () => {
    setLoading(false);
  };
  return (
    <ImgContainer>
      {!hideDeleteButton && (
        <XButton type="button" onClick={onRemove}>
          X
        </XButton>
      )}
      {loading && <CircleSpinner />}
      {!responsiveImageData && <ThumbnailPreview src={base64 || placeHolder} alt="user-uploaded" onLoad={handleImageLoaded} />}
      {!!responsiveImageData && (
        <picture onLoad={handleImageLoaded}>
          <source media={mediaQueries.px320} srcSet={responsiveImageData.px320.url} />
          <source media={mediaQueries.px600} srcSet={responsiveImageData.px600.url} />
          <source media={mediaQueries.px900} srcSet={responsiveImageData.px900.url} />
          <source media={mediaQueries.orig} srcSet={responsiveImageData.orig.url} />
          <ThumbnailPreview
            src={responsiveImageData.orig.url}
            alt={mediaQueries.current() ? responsiveImageData[mediaQueries.current()].url : 'image-download-name-absent'}
            onClick={onThumbnailClick}
          />
        </picture>
      )}
    </ImgContainer>
  );
};
type Props = {
  images: ImageStateList;
  onRemoveClick: (uniqueId: string) => void;
  onThumbnailClick: (index) => void;
  hideDeleteButton: boolean;
};
export default ({ images, onRemoveClick, onThumbnailClick, hideDeleteButton }: Props) => (
  <SmallCarousel>
    {images.map((img, index) => (
      <Thumbnail
        key={index}
        onRemove={() => onRemoveClick(img.uniqueId)}
        onThumbnailClick={() => onThumbnailClick(index)}
        responsiveImageData={img.responsiveImageData || undefined}
        base64={img.base64 || undefined}
        hideDeleteButton={hideDeleteButton}
      />
    ))}
  </SmallCarousel>
);
