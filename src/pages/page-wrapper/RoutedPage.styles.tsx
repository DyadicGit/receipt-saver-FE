import { Link } from 'react-router-dom';
import styled from 'styled-components';
import img from './background-blue.jpg';
import { colors } from '../../config/styleConstants';

export const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-image: url(${img});
`;
export const Page = styled.div`
  overflow-y: auto;
  position: fixed;
  top: 0;
  -webkit-overflow-scrolling: touch;
  background-color: ${colors.pageWrapper.backgroundEclipse};
`;

const navBarHeight = '10vh';
const navBarHeightLandscape = '20vh';
export const bodyHeight = '90vh';
export const bodyHeightLandscape = '80vh';
export const bodyWidth = '90vw';
export const PageContainer = styled.div`
  font-size: calc(10px + 2vmin);
  color: white;
  display: grid;
  grid-template-columns: 5vw ${bodyWidth} 5vw;
  grid-template-rows: ${navBarHeight} ${bodyHeight};
  @media screen and (orientation: landscape) {
    grid-template-rows: ${navBarHeightLandscape} ${bodyHeightLandscape};
  }

  grid-template-areas:
    '. navbar .'
    '. pageBody .';
`;
export const PageBody = styled.div`
  grid-area: pageBody;
`;
export const Nav = styled.div`
  max-height: ${navBarHeight};
  @media screen and (orientation: landscape) {
    max-height: ${navBarHeightLandscape};
  }
  width: 100%;
  grid-area: navbar;
  display: grid;
  grid-template-columns: 25px auto 1fr 15px;
  grid-gap: 10px;
  position: fixed;
  background: radial-gradient(black 15%, transparent 16%) 0 0, radial-gradient(black 15%, transparent 16%) 8px 8px,
    radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 0 1px, radial-gradient(rgba(255, 255, 255, 0.1) 15%, transparent 20%) 8px 9px;
  background-color: black;
  z-index: 1;
  background-size: 16px 16px;
`;

export const BackButton = styled.div`
  grid-column: 1/2;
`;
export const WideLink = styled(Link)`
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0;
  margin-inline-end: 0;
`;
export const Title = styled.h3`
  grid-column: 2/3;
  margin-left: 5vw;
  color: white;
`;

export const AdditionalButtonsContainer = styled.div`
  grid-column: 3/4;
  justify-self: right;
  align-self: center;
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 3vw;
`;
