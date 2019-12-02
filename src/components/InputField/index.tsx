import React, { Dispatch } from "react";
import { toNumber } from "../../pages/receipt-page/utils";
import { InputField } from "./InputField.styles";

type FieldProps = {
  text: string;
  value: any;
  setter: Dispatch<any>;
  type?: string;
  disabled?: boolean;
};

export default ({ text, value, setter, type = 'text', disabled = false }: FieldProps) => {
  const id = text.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]/g, '');
  const clearZeros = (ev) => {
    if (type === 'number' && !toNumber(value)) {
      ev.target.value=''
    }
  };

  return (
    <InputField editable={!disabled}>
      <label htmlFor={id}>{text}
        <input id={id} type={type} value={value} onChange={e => setter(e.target.value)} disabled={disabled} onFocus={clearZeros} autoComplete="off"/>
      </label>
    </InputField>
  );
};
