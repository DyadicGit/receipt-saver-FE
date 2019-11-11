import React, { Dispatch } from "react";
import styles from './InputField.module.css';
import cx from 'classnames';

type FieldProps = {
  text: string;
  value: any;
  setter: Dispatch<any>;
  type?: string;
  disabled?: boolean;
};

const InputField = ({ text, value, setter, type = 'text', disabled = false }: FieldProps) => {
  const id = text.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]/g, '');
  return (
    <div className={styles.inputField}>
      <label className={cx(!disabled && styles.editable)} htmlFor={id}>{text}
        <input id={id} type={type} value={value} onChange={e => setter(e.target.value)} disabled={disabled}/>
      </label>
    </div>
  );
};

export default InputField;
