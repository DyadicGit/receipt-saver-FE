import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: ${props => props.color};
  scroll-snap-align: start;
`;
const Right = styled.div`
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
`;
export const Header = styled.div`
  width: 100%;
  left: 0;
  position: fixed;
  top: 0;
  z-index: 99;
`;
export const TopBar = styled.nav`
  overflow: hidden;
  height: 45px;
  line-height: 45px;
  position: relative;
  background: #333333;
  margin-bottom: 0;
`;
export default ({ elements }) => {
  const { id } = useParams();
  const refs = elements.reduce((acc, el) => {
    acc[el.id] = useRef(null);
    return acc;
  }, {});

  useEffect(() => {
    if (id && refs) {
      setTimeout(() => {
        if (id && refs && refs[id] && refs[id].current)
          refs[id].current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
      }, 100);
    }
  }, [id, refs]);

  return (
    <>
      <div>
        <Header>
          <TopBar>HEader</TopBar>
        </Header>
      </div>
      <Right>
        {elements.map((el, i) => (
          <PageContainer key={i} color={el.color} ref={refs[el.id]}>
            <span>{el.text}</span>
          </PageContainer>
        ))}
      </Right>
    </>
  );
};
