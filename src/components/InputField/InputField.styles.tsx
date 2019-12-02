import styled from "styled-components";
import { colors } from "../../config/styleConstants";

export const InputField = styled.div`
    position: relative;
 & input {
    background-color: transparent;
    border: none;
    border-bottom: 1px solid ${colors.inputField.border};
    border-radius: 0;
    outline: none;
    height: 2.5rem;
    width: 100%;
    font-size: 1rem;
    margin: 0 0 15px 0;
    padding: 0;
    box-shadow: none;
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    transition: all .3s;
    color: white;
}
 & input:focus {
    border-bottom: 1px solid ${colors.inputField.borderFocus};
    box-shadow: 0 1px 0 0 ${colors.inputField.borderFocus};
    -webkit-appearance: none;
}
& input[type=number]::-webkit-inner-spin-button,
& input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
& input[type=date]::-webkit-inner-spin-button,
& input[type=date]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
& input:-webkit-autofill,
& input:-webkit-autofill:hover,
& input:-webkit-autofill:focus,
& textarea:-webkit-autofill,
& textarea:-webkit-autofill:hover,
& textarea:-webkit-autofill:focus,
& select:-webkit-autofill,
& select:-webkit-autofill:hover,
& select:-webkit-autofill:focus {
    border-bottom: 2px solid ${colors.inputField.borderAutofill};
    -webkit-text-fill-color: white;
    -webkit-box-shadow: 0 0 0 1000px #000 inset;
    transition: background-color 5000s ease-in-out 0s;
}
& label {
    color: ${(props: {editable: boolean}) => props.editable ? `${colors.inputField.editable} !important` : colors.inputField.label};
    font-size: 1rem;
    cursor: text;
    -webkit-transition: .2s ease-out;
    -moz-transition: .2s ease-out;
    -o-transition: .2s ease-out;
    -ms-transition: .2s ease-out;
    transition: .2s ease-out;
}
& label:focus-within {
    color: ${colors.inputField.labelFocus};
}
`;
