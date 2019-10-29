import { BehaviorSubject, from, isObservable, Observable } from 'rxjs';
import { flatMap, scan } from 'rxjs/operators';

export type Action = {
  type: string;
  payload: any;
};
export type ResolvableAction = {
  type: string;
  payload: Observable<Action>;
};

export const createStore = (initState, reducer) => {
  const action$ = new BehaviorSubject(initState);
  return {
    store$: action$.pipe(
      flatMap(action => (isObservable(action) ? action : from([action]))),
      scan(reducer)
    ),
    actionCreator: func => (...args) => {
      const action: Action = func(...args);
      action$.next(action);
      if (isObservable(action.payload)) action$.next(action.payload);
      return action;
    }
  };
};
