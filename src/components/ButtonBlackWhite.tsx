import styled from 'styled-components';
import { colors } from "../config/styleConstants";

export const InputButton = styled.input`
  border: 0.1em solid white;
  border-radius: 0.12em;
  text-decoration: none;
  font-weight: bold;
  text-align: center;
  transition: all 0.2s;
  color: white;
  background-color: inherit;
  :hover, :active {
    color: black;
    background-color: white;
  }
`;

const ButtonBlackWhite = styled(InputButton)`
  display: inline-block;
  padding: 10px 4vw;
  margin: 0.5em;
  color: white;
  background-color: ${(props: {red?: boolean}) => props.red ? colors.buttonError : 'inherit'};
`;

export default ButtonBlackWhite;
