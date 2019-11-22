import { BehaviorSubject, from, isObservable, Observable } from 'rxjs';
import { flatMap, scan } from 'rxjs/operators';

export type SyncAction<P> = {
  type: string;
  payload: P;
};
export type AsyncAction<P> = Observable<SyncAction<P>>

export type Action<SyncOrAsync> = {
  type: string;
  payload: SyncOrAsync;
};

export const createStore = (initState, reducer) => {
  const action$ = new BehaviorSubject(initState);
  return {
    store$: action$.pipe(
      flatMap(action => (isObservable(action) ? action : from([action]))),
      scan(reducer)
    ),
    actionCreator: <SyncOrAsync>(func) => (...args) => {
      const action: Action<SyncOrAsync> = func(...args);
      action$.next(action);
      if (isObservable(action.payload)) action$.next(action.payload);
      return action;
    }
  };
};
