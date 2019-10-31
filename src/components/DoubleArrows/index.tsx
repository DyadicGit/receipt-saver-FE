import React from 'react';
import cx from 'classnames'
import styles from './DoubleArrows.module.css';

const DoubleArrow = () => (
  <div className={styles.arrows}>
    <span className={cx(styles.arrow, styles.primary, styles.nextIcon)} />
    <span className={cx(styles.arrow, styles.secondary, styles.nextIcon)} />
  </div>
);
export default DoubleArrow;
