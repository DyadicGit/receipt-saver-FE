import styled from 'styled-components';

export const List = styled.ul`
  list-style-type: none;
  word-break: break-word;
  padding: 0;
`;

export const Line = styled.li`
  margin-top: 2vh;
  border-radius: 0.1em;
  transition: ease-out 0.3s;
  border: solid 1px #d3d63854;
  //grid
  display: grid;
  grid-template-columns: 0.2fr 0.8fr;
  grid-template-rows: repeat(3, 1fr);
  gap: 10px 20px;
  padding: 1vh 3vw 1vh 3vw;
  position: relative;
  span:nth-child(even) {
    color: #9db396;
  }
  div {
    grid-column: 1/3;
    justify-self: center;
  }
  //Visual Effects
  &.selectEffect:hover,
  &.selectEffect:active {
    background: #3067195e;
  }
  &.selectEffect:hover&.selectEffect::after,
  &.selectEffect:active&.selectEffect::after {
    opacity: 0.4;
  }
  &.selectEffect::after {
    content: '';
    position: absolute;
    right: 0;
    align-self: center;
    width: 0;
    height: 0;
    border-top: 35px solid transparent;
    border-left: 25px solid #d3d63854;
    border-bottom: 35px solid transparent;
    clear: both;
    opacity: 0;
    transition: ease-in 500ms;
  }

  &.triangleEffect:hover&.triangleEffect::after,
  &.triangleEffect:active&.triangleEffect::after {
    opacity: 0.4;
  }
  &.triangleEffect::after {
    content: '';
    position: absolute;
    right: 0;
    align-self: center;
    width: 0;
    height: 0;
    border-top: 35px solid transparent;
    border-left: 25px solid #d3d63854;
    border-bottom: 35px solid transparent;
    clear: both;
    opacity: 0;
    transition: ease-in 500ms;
  }
`;

export const YellowDate = styled.div`
  color: #c8d406;
`;
