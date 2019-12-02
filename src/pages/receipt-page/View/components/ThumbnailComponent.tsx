import { ResponsiveImageData } from '../../../../config/DomainTypes';
import React, { useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as circleSpinner } from '../../../../components/circleSpinner.svg';

const imgContainerSidePadding = '10px';
const ImgContainer = styled.div`
  height: 100%;
  padding: 0 ${imgContainerSidePadding} 0 ${imgContainerSidePadding};
  position: relative;
  scroll-snap-align: start;
`;

const svgIconSize = '36px';
const CircleSpinner = styled(circleSpinner)`
  position: absolute;
  top: calc(50% - ${svgIconSize});
  left: 15vw;
`;
const XButton = styled.button`
  position: absolute;
  top: 5px;
  width: calc(100% - ${imgContainerSidePadding} - ${imgContainerSidePadding});
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
const Img = styled.img`
  height: 100%;
  min-width: 30vw;
`;

const placeHolder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=';

type ImageBoxProps = { onRemove: () => void; onPreviewClick: () => void; base64: string | undefined; responsiveImageData: ResponsiveImageData | undefined; hideDeleteButton: boolean };

export default ({ onRemove, onPreviewClick, base64, responsiveImageData, hideDeleteButton }: ImageBoxProps) => {
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
      {!responsiveImageData && <Img src={base64 || placeHolder} alt="user-uploaded" />}
      {!!responsiveImageData && (
        <picture onLoad={handleImageLoaded}>
          <source media="(max-width: 600px)" srcSet={responsiveImageData.px320.url} />
          <source media="(max-width: 900px)" srcSet={responsiveImageData.px600.url} />
          <source media="(max-width: 1200px)" srcSet={responsiveImageData.px900.url} />
          <source media="(min-width: 1200px)" srcSet={responsiveImageData.orig.url} />
          <Img src={responsiveImageData.orig.url} alt={responsiveImageData.orig.key} onClick={onPreviewClick}/>
        </picture>
      )}
    </ImgContainer>
  );
};
