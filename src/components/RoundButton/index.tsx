import React from 'react';
import { Link } from 'react-router-dom';
import styles from './RoundButton.module.css';
import cx from 'classnames';


export default () => {
  return (
    <Link className={cx(styles.fixedBottomCorner, styles.roundButton)} to="/receipt/create">
      <span className={styles.largeAndCentered}>+</span>
    </Link>
  );
};
