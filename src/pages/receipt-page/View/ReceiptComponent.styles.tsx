import styled from 'styled-components';
import { colors } from "../../../config/styleConstants";

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
    background-color: ${(props: UploadButtonProps) => (props.red ? colors.buttonError : 'inherit')};
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
