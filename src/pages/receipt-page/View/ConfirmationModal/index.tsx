import React from 'react';
import { CSSTransition } from 'react-transition-group';
import './modalTransition.css';
import cx from 'classnames';
import buttonStyles from '../../../../components/Button/Button.module.css';
import spinnerStyles from '../../../../components/PetalSpinner/PetalSpinner.module.css';
import styles from './ConfirmationModal.module.css';

type Props = { show: boolean; onEnter?: () => void; onExit?: () => void; onConfirm: () => void; onDismiss: () => void };
export default ({ show, onEnter, onExit, onConfirm, onDismiss }: Props) => (
  <>
    <CSSTransition in={show} timeout={300} classNames="confModal" unmountOnExit onEnter={onEnter} onExited={onExit}>
      <div className={cx(styles.container)}>
        <p>Are you sure you want to DELETE it?</p>
        <input type="button" value="YES" className={cx(buttonStyles.blackAndWhite, buttonStyles.red)} onClick={onConfirm} />
        <input type="button" value="NO" className={buttonStyles.blackAndWhite} onClick={onDismiss} />
      </div>
    </CSSTransition>
    {show && <div className={cx(spinnerStyles.fullPageDimming, styles.belowSpinner)} />}
  </>
);
