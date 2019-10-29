import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import './page.transition.css';
import gridStyles from './grid.module.css';
import styles from './header.module.css';

const NavBar = ({ pageTitle, isPrev }) => (
  <div className={gridStyles.nav}>
    {isPrev && (
      <div className={gridStyles.nav__backButton}>
        <Link className={styles.backButton} to={'/receipt'}>
          back
        </Link>
      </div>
    )}
    <h3 className={gridStyles.nav__header}>{pageTitle}</h3>
  </div>
);

type Props = {
  children: React.ReactNode;
  pageTitle?: string;
  background?: string;
  location: any;
};
const RoutedPage = ({ children, background, pageTitle, location: { pathname } }: Props) => {
  const isPrev = pathname !== '/receipt';

  return (
    <div className={`page ${isPrev ? 'page--prev' : ''}`}>
      <div className={gridStyles.pageContainer} style={{ backgroundColor: background }}>
        <NavBar pageTitle={pageTitle} isPrev={isPrev} />
        <div className={gridStyles.pageBody}>{children}</div>
      </div>
    </div>
  );
};

export default withRouter(RoutedPage);
