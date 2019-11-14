import React from 'react';
import { withRouter } from 'react-router-dom';
import cx from 'classnames';
import DoubleArrow from '../../components/DoubleArrows';
import { AdditionalButtonsContainer, BackButton, Nav, Page, PageBody, PageContainer, Title, WideLink } from './RoutedPage.styles';
import './page.transition.css';

const NavBar = ({ pageTitle, isPrev, buttons }) => (
  <Nav>
    {isPrev && (
      <BackButton>
        <WideLink to={'/receipt'}>
          <DoubleArrow />
        </WideLink>
      </BackButton>
    )}
    <Title>{pageTitle}</Title>
    <AdditionalButtonsContainer>
      {buttons.map((S, i) => (
        <React.Fragment key={i}>{S}</React.Fragment>
      ))}
    </AdditionalButtonsContainer>
  </Nav>
);

type Props = {
  children: React.ReactNode;
  pageTitle: string;
  buttons?: React.Component[];
  location: any;
  refBody?: any;
  refPage?: any;
};
const RoutedPage = ({ children, pageTitle,  buttons, location: { pathname }, refBody, refPage }: Props) => {
  const isPrev = pathname !== '/receipt';
  return (
    <Page className={cx('page', isPrev && 'page--prev')} ref={refPage}>
      <PageContainer>
        <NavBar pageTitle={pageTitle} isPrev={isPrev} buttons={buttons} />
        <PageBody ref={refBody}>{children}</PageBody>
      </PageContainer>
    </Page>
  );
};

export default withRouter(RoutedPage);
