import styled from 'styled-components';

export const Carousel = styled.div`
  height: ${(props: { empty: boolean }) => (props.empty ? 'auto' : '30vh')};
  display: flex;
  margin-top: 10px;
  padding: 10px 0 10px 0;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
`;

export const Img = styled.img`
  height: 100%;
  padding: 0 10px 0 10px;
  scroll-snap-align: start;
`;

type UploadButtonProps = { red?: boolean, disabled: boolean }
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
      color: ${(props: UploadButtonProps) => (props.disabled ? 'inherit' : 'black')};
      background-color: ${(props: UploadButtonProps) => (props.disabled ? 'inherit' : 'white')};
    }
  }
  input {
    display: none;
  }
`;
