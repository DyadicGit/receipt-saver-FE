import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ResponsiveImageDataList } from '../../../../../config/DomainTypes';
import { Carousel, CircleSpinner, Img, ImgContainer, imgContainerSidePadding } from "./ImagePreview.styles";
import { colors } from "../../../../../config/styleConstants";
import { bodyHeight, bodyHeightLandscape, bodyWidth } from "../../../../page-wrapper/RoutedPage.styles";

export const BigCarousel = styled(Carousel)`
  background-color: ${colors.pageWrapper.backgroundEclipse};
  align-items: center;
  max-height: ${bodyHeight};
  @media screen and (orientation: landscape) {
    max-height: ${bodyHeightLandscape};
  }
`;

const FullImagePreview = styled(Img)`
  max-height: 100%;
  max-width: calc(${bodyWidth} - 2 * ${imgContainerSidePadding});
`;

type Props = { images: ResponsiveImageDataList; onExit: () => void; imageIndex: number };
export default ({ images, onExit: handleImageClick, imageIndex }: Props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const handleImageLoaded = () => {
    setLoading(false);
  };
  const imgRefs: { [index: number]: MutableRefObject<any> } = images.reduce((acc, img, index) => ({ ...acc, [index]: useRef(null) }), {});
  useEffect(() => {
    if (imgRefs[imageIndex] && imgRefs[imageIndex].current) {
      setTimeout(() => {
        if (imgRefs[imageIndex] && imgRefs[imageIndex].current) {
          imgRefs[imageIndex].current.scrollIntoView({ inline: 'center', block: "end", behavior: 'smooth' });
        }
      }, 100);
    }
  });
  return (
    <BigCarousel>
      {images.map((img, index) => (
        <ImgContainer key={index} ref={imgRefs[index]}>
          {loading && <CircleSpinner />}
          <FullImagePreview
            src={img.orig.url}
            alt={img.orig.key}
            onClick={handleImageClick}
            onLoad={handleImageLoaded}
          />
        </ImgContainer>
      ))}
    </BigCarousel>
  );
};
