import styled from 'styled-components';

export const Carousel = styled.div`
  height: 30vh;
  display: flex;
  margin-top: 10px;
  padding: 10px 0 10px 0;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
`;
export const ImgContainer = styled.div`
  height: 100%;
  padding: 0 10px 0 10px;
  position: relative;
  scroll-snap-align: start;
`;
export const XButton = styled.button`
  position: absolute;
  top: 0;
  right: 10px;
  display: inline-block;
  padding: 4px 2vw;
  border: 0.1em solid white;
  margin: 0.5em;
  border-radius: 0.12em;
  box-sizing: border-box;
  text-decoration: none;
  font-weight: bold;
  color: white;
  background-color: inherit;
  text-align: center;
  transition: all 0.2s;
  :hover {
    color: white;
    background-color: red;
  }
`;

type UploadButtonProps = { red?: boolean }
export const UploadButton = styled.div`
  label {
    display: inline-block;
    width: 100%;
    padding: 10px 4vw;
    border: 0.1em solid white;
    border-radius: 0.12em;
    box-sizing: border-box;
    text-decoration: none;
    font-weight: bold;
    color: white;
    background-color: ${(props: UploadButtonProps) => (props.red ? 'rgba(255, 7, 3, 0.57)' : 'inherit')};
    text-align: center;
    transition: all 0.2s;
    :hover {
      color: black;
      background-color: white;
    }
  }
  input {
    display: none;
  }
`;
