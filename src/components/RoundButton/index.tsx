import React from 'react';
import styles from './RoundButton.module.css';
import cx from 'classnames';

type Props = { onClick?: () => void };

export default ({ onClick }: Props) => {
  return (
    <button className={cx(styles.fixedBottomCorner, styles.roundButton)} onClick={onClick}>
      <span className={styles.largeAndCentered}>+</span>
    </button>
  );
};
