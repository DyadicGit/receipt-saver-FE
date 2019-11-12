import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { helloWorldApi } from '../config/endpoints';
import { Header } from "./AllPages";

const Section = styled.section`
  height: 10vw;
  scroll-snap-align: start;
  background-color: ${props => props.color};
`;

const Left = styled.div`
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  height: 100%;
`;

export default ({ elements }) => {
  const [text, setText] = useState('');
  useEffect(() => {
    fetch(helloWorldApi)
      .then(response => response.text())
      .then(setText);
  }, []);

  return (
    <>
      <Header>HEader</Header>
      <Left>
        {elements.map((s, i) => (
          <Section key={i} color={s.color}>
            <Link to={`/receipts/all/${s.id}`}>
              {text}
              {s.text}
            </Link>
          </Section>
        ))}
      </Left>
    </>
  );
};
