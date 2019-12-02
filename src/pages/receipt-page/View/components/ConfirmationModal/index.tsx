import React from 'react';
import { CSSTransition } from 'react-transition-group';
import './modalTransition.css';
import ButtonBlackWhite from '../../../../../components/ButtonBlackWhite';
import styled from 'styled-components';
import FullPageDimmer from '../../../../../components/FullPageDimmer';

const GlowShadowBox = styled.div`
  z-index: 3;
  position: absolute;
  left: 5vw;
  right: 5vw;
  top: 35vh;
  text-align: center;
  box-shadow: 0 0 25px 10px rgb(166, 255, 23);
  padding: 0 1em 1em 1em;
  background-color: black;
  opacity: 0.8;
  color: white;
  input:first-of-type {
    margin-right: 15vw;
  }
`;

type Props = { show: boolean; onEnter?: () => void; onExit?: () => void; onConfirm: () => void; onDismiss: () => void };
export default ({ show, onEnter, onExit, onConfirm, onDismiss }: Props) => (
  <>
    <CSSTransition in={show} timeout={100} classNames="confModal" unmountOnExit onEnter={onEnter} onExited={onExit}>
      <GlowShadowBox>
        <p>Are you sure you want to DELETE it?</p>
        <ButtonBlackWhite type="button" value="YES" red onClick={onConfirm} />
        <ButtonBlackWhite type="button" value="NO" onClick={onDismiss} />
      </GlowShadowBox>
    </CSSTransition>
    {show && <FullPageDimmer zIndex={2} />}
  </>
);
