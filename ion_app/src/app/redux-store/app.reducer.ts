import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { mainReducer } from './main/main.reducer';

export const reducers: ActionReducerMap<AppState> = {
  main: mainReducer
};
