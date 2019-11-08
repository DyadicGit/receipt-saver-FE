import React from 'react';
import './pages/page-wrapper/grid.module.css';
import HelloWorldPage from './pages/HelloWorldPage';
import { BrowserRouter, Redirect, Route, Switch, useLocation, useHistory } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ReceiptList from './pages/receipt-page/List/ReceiptList';
import ReceiptContainer from './pages/receipt-page/View/ReceiptContainer';
import Page404 from './pages/Page404';

const transitionDuration = 1000; // 1s also in page.transition.css
const timeout = { enter: transitionDuration, exit: transitionDuration };

const ReceiptSwitcher = ({receipts}) => {
  const location = useLocation();
  const history = useHistory();
  const receiptId = location.pathname.replace(/\/receipt\/|\/receipt/, '');
  if (
    location.pathname !== '/receipt/create'
    && receipts.order.length
    && receiptId && !receipts.byId[receiptId]
  ) {
    history.push('/404')
  }
  return (
    <TransitionGroup className="transition-group">
      <CSSTransition key={location.key} classNames="page" timeout={timeout}>
        <Switch location={location}>
          <Route exact path="/receipt" component={ReceiptList} />
          <Route path="/receipt/create">
            <ReceiptContainer initMode="CREATE"/>
          </Route>
          <Route path="/receipt/:id">
            <ReceiptContainer initMode="VIEW"/>
          </Route>
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};

const App = ({state}) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/helloWorld" component={HelloWorldPage} />
        <Route exact path="/">
          <Redirect to="/receipt" />
        </Route>
        <Route path="/receipt*">
          <ReceiptSwitcher receipts={state.receipts}/>
        </Route>
        <Route path="/create">
          <ReceiptSwitcher receipts={state.receipts}/>
        </Route>
        <Route path="/404">
          <Page404 code="404"/>
        </Route>
        <Route>
          <Page404 code="404"/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
export default App;
