import React from 'react';
import styles from './page404.module.css';

export default ({ code }) => (
  <div className={styles.container}>
    <div className={styles.effect} title={code}>{code}</div>
  </div>
);
