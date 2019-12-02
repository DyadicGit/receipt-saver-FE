import React, { MutableRefObject, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import { ResponsiveImageDataList } from '../../../../../config/DomainTypes';
import './fullScreenTransition.css';

const FullScreenContainer = styled.div`
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  background: black;
`;

const Carousel = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
`;
const ImgContainer = styled.div`
  scroll-snap-align: start;
  padding: 0 5vw 0 5vw;
  width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;
const Img = styled.img`
  z-index: 2;
  @media screen and (orientation: portrait) {
    max-width: 90vw;
  }
  @media screen and (orientation: landscape) {
    max-height: 90vh;
  }
`;
const ExitSection = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
`;

type Props = { images: ResponsiveImageDataList; onExit: () => void; show: boolean; imageIndex: number };
export default ({ images, onExit: handleExit, show, imageIndex }: Props) => {
  const imgRefs: { [index: number]: MutableRefObject<any> } = images.reduce((acc, img, index) => ({ ...acc, [index]: useRef(null) }), {});
  useEffect(() => {
    if (imgRefs[imageIndex] && imgRefs[imageIndex].current) {
      setTimeout(() => {
        if (imgRefs[imageIndex] && imgRefs[imageIndex].current) {
          imgRefs[imageIndex].current.scrollIntoView({ inline: 'center', behavior: 'smooth' });
        }
      }, 100);
    }
  });
  return (
    <CSSTransition in={show} timeout={250} classNames="fullScreenPreview" unmountOnExit>
      <FullScreenContainer>
        <Carousel>
          {images.map((img, index) => (
            <ImgContainer key={index} ref={imgRefs[index]}>
              <ExitSection onClick={handleExit} />
              <Img src={img.orig.url} alt={img.orig.key} />
            </ImgContainer>
          ))}
        </Carousel>
      </FullScreenContainer>
    </CSSTransition>
  );
};
