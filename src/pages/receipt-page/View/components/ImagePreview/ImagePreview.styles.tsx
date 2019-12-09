import styled from 'styled-components';
import { ReactComponent as circleSpinner } from '../../../../../components/circleSpinner.svg';

export const flexInitSizeFix = 'max-width: fit-content;';

export const imgContainerSidePadding = '10px';
export const ImgContainerWrapper = styled.div`
  ${flexInitSizeFix};
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  padding: 0 ${imgContainerSidePadding} 0 ${imgContainerSidePadding};
  scroll-snap-align: start;
`;

export const Carousel = styled.div`
  display: flex;
  margin-top: 10px;
  padding: 10px 0 10px 0;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
`;
export const Img = styled.img`
  ${flexInitSizeFix};
  max-height: 100%;
  object-fit: scale-down;
`;

const svgIconSize = '36px';
export const CircleSpinner = styled(circleSpinner)`
  position: absolute;
  top: calc(50% - ${svgIconSize});
  left: 15vw;
  @media screen and (orientation: landscape) {
    left: 6vw;
  }
`;
