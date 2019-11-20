import React from 'react';
import styles from './page404.module.css';
import DoubleArrow from '../../components/DoubleArrows';
import styled from 'styled-components';

const blockHeight = '25px';

const WideLink = styled.a`
  display: block;
  block-size: ${blockHeight};
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 1em;
  margin-inline-end: 0;
`;
const Container404 = styled.div`
    display: flex;
    width: 100vw;
    height: calc(100vh - ${blockHeight});
    align-items: center;
    justify-content: center;
    margin: 0;
    color: white;
    font-size: 96px;
    font-family: 'Fira Mono', monospace;
    letter-spacing: -7px;
`;

export default ({ code }) => (
  <>
    <WideLink href="/receipt">
      <DoubleArrow />
    </WideLink>
    <Container404>
      <div className={styles.effect} title={code}>
        {code}
      </div>
    </Container404>
  </>
);
