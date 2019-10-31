import React from 'react';
import styles from './PetalSpinner.module.css';
import cx from 'classnames';

const PetalSpinner = () => (
  <>
    <div className={styles.fullPageDimming} />
    <div className={styles.container}>
      <div className={cx(styles.one, styles.common)} />
      <div className={cx(styles.two, styles.common)} />
      <div className={cx(styles.three, styles.common)} />
      <div className={cx(styles.four, styles.common)} />
      <div className={cx(styles.five, styles.common)} />
      <div className={cx(styles.six, styles.common)} />
      <div className={cx(styles.seven, styles.common)} />
      <div className={cx(styles.eight, styles.common)} />
    </div>
  </>
);

export default PetalSpinner;
