import React from 'react';
import './pages/page-wrapper/grid.module.css';
import HelloWorldPage from './pages/HelloWorldPage';
import { BrowserRouter, Route, Redirect, Switch, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import ReceiptList from './pages/receipt-page/ReceiptList';
import ReceiptView from './pages/receipt-page/ReceiptView';
import './App.css';

const transitionDuration = 1000; // 1s also in page.transition.css
const timeout = { enter: transitionDuration, exit: transitionDuration };

const ReceiptSwitcher = () => {
  let location = useLocation();
  return (
    <TransitionGroup className="transition-group">
      <CSSTransition key={location.key} classNames="page" timeout={timeout}>
        <Switch location={location}>
          <Route exact path="/receipt" component={ReceiptList} />
          <Route path="/receipt/:id" component={ReceiptView} />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/helloWorld" component={HelloWorldPage} />
        <Route exact path="/">
          <Redirect to="/receipt" />
        </Route>
        <Route path="/receipt*">
          <ReceiptSwitcher />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
export default App;
