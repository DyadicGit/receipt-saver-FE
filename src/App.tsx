import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ReceiptContainer from './pages/receipt-page/View/ReceiptContainer';
import Page404 from './pages/Page404';
import PetalSpinner from './components/PetalSpinner';
import { Background } from './pages/page-wrapper/RoutedPage.styles';
const ReceiptList = lazy(() => import('./pages/receipt-page/List/ReceiptList'));

const transitionDuration = 400; // 1s also in page.transition.css
const timeout = { enter: transitionDuration, exit: transitionDuration };

const ReceiptSwitcher = ({ state }) => {
  const location = useLocation();
  return (
    <TransitionGroup className="transition-group">
      <CSSTransition key={location.key} classNames="page" timeout={timeout}>
        <Switch location={location}>
          <Route exact path="/receipt">
            <ReceiptList state={state} />
          </Route>
          <Route path="/receipt/create">
            <ReceiptContainer initMode="CREATE" state={state} />
          </Route>
          <Route path="/receipt/:id">
            <ReceiptContainer initMode="VIEW" state={state} />
          </Route>
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};

const App = ({ state }) => {
  return (
    <>
      <Background />
      <BrowserRouter>
        {state && state.isLoading && <PetalSpinner />}
        <Suspense fallback={<PetalSpinner />}>
          <Switch>
            <Route exact path="/">
              <Redirect to="/receipt" />
            </Route>
            <Route path="/receipt*">
              <ReceiptSwitcher state={state} />
            </Route>
            <Route exact path="/helloWorld" component={lazy(() => import('./pages/HelloWorldPage'))} />
            <Route path="/404">
              <Page404 code="404" />
            </Route>
            <Route exact path="/index.html">
              <Redirect to="/receipt" />
            </Route>
            <Route>
              <Page404 code="404" />
            </Route>
          </Switch>
        </Suspense>
      </BrowserRouter>
    </>
  );
};
export default App;
