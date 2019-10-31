import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import cx from 'classnames';
import DoubleArrow from '../../components/DoubleArrows';
import './page.transition.css';
import gridStyles from './grid.module.css';

const NavBar = ({ pageTitle, isPrev }) => (
  <div className={gridStyles.nav}>
    {isPrev && (
      <div className={gridStyles.backButton}>
        <Link className={gridStyles.wider} to={'/receipt'}>
          <DoubleArrow />
        </Link>
      </div>
    )}
    <h3 className={gridStyles.title}>{pageTitle}</h3>
  </div>
);

type Props = {
  children: React.ReactNode;
  pageTitle?: string;
  background?: string;
  location: any;
};
const RoutedPage = ({ children, pageTitle, location: { pathname } }: Props) => {
  const isPrev = pathname !== '/receipt';
  return (
    <div className={cx('page', isPrev && 'page--prev')}>
      <div className={gridStyles.pageContainer}>
        <NavBar pageTitle={pageTitle} isPrev={isPrev} />
        <div className={gridStyles.pageBody}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default withRouter(RoutedPage);
