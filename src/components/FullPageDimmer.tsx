import styled from 'styled-components';

export default styled.div`
  z-index: ${(props: { zIndex?: number }) => props.zIndex || 10};
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #282c34c7;
`;
