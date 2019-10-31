import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.css';

type Props = {
  text: string;
  to: string;
};

export default ({ text, to = '/receipt' }: Props) => (
  <Link className={styles.blackAndWhite} to={to}>
    {text}
  </Link>
);
