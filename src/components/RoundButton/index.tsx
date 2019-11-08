import React from 'react';
import styles from './RoundButton.module.css';
import cx from 'classnames';

export default () => {
  return <a className={cx(styles.fixedBottomCorner, styles.roundButton)}>+</a>;
};
