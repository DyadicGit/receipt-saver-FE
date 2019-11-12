import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import cx from 'classnames';
import DoubleArrow from '../../components/DoubleArrows';
import './page.transition.css';
import gridStyles from './grid.module.css';

const NavBar = ({ pageTitle, isPrev, buttons }) => (
  <div className={gridStyles.nav}>
    {isPrev && (
      <div className={gridStyles.backButton}>
        <Link className={gridStyles.wider} to={'/receipt'}>
          <DoubleArrow />
        </Link>
      </div>
    )}
    <h3 className={gridStyles.title}>{pageTitle}</h3>
    <div className={gridStyles.additionalButtons}>{buttons.map((S, i) => <React.Fragment key={i}>{S}</React.Fragment>)}</div>
  </div>
);

type Props = {
  children: React.ReactNode;
  pageTitle?: string;
  buttons?: React.Component[];
  background?: string;
  location: any;
};
const RoutedPage = ({ children, pageTitle, buttons, location: { pathname } }: Props) => {
  const isPrev = pathname !== '/receipt';
  return (
    <div className={cx('page', isPrev && 'page--prev')}>
      <div className={gridStyles.pageContainer}>
        <NavBar pageTitle={pageTitle} isPrev={isPrev} buttons={buttons}/>
        <div className={gridStyles.pageBody}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default withRouter(RoutedPage);
