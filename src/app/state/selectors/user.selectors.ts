// Selectors
import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { UserListState } from 'src/app/modules/user/models/user.model';

export const selectFeature = (state: AppState) => state.userList;

export const selectUsers = createSelector(
  selectFeature,
  (state: UserListState) => state.users
);

export const selectLoading = createSelector(
  selectFeature,
  (state: UserListState) => state.loading
);