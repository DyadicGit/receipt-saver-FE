import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { scan, tap } from 'rxjs/operators';
import App from './App';
import { receiptStore, StateContext } from './rxjs-as-redux/storeInstances';
import { merge, Observable } from 'rxjs';

const container = document.getElementById('root');
const appStores$: Observable<any> = merge(receiptStore.store$).pipe(
  scan((acc, state) => ({ ...acc, ...state })),
  tap(state => {
    console.log(state);
  })
);

appStores$.subscribe(state =>
  ReactDOM.render(
    <StateContext.Provider value={state}>
      <App />
    </StateContext.Provider>,
    container
  )
);

serviceWorker.register();
