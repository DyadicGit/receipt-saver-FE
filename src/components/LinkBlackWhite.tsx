import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const LinkBlackWhite = styled(Link)`
  display: inline-block;
  padding: 4px 4vw 6px 4vw;
  border: 0.1em solid white;
  border-radius: 0.12em;
  box-sizing: border-box;
  text-decoration: none;
  font-weight: bold;
  color: white;
  background-color: ${(props: { red?: boolean }) => (props.red ? 'rgba(255, 7, 3, 0.57)' : 'inherit')};
  text-align: center;
  transition: all 0.2s;
  :hover {
    color: black;
    background-color: white;
  }
`;
export default ({ to, title }: { to: string; title: string }) => {
  return <LinkBlackWhite to={to}>{title}</LinkBlackWhite>;
};
