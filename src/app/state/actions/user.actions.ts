// Actions
import { createAction, props } from "@ngrx/store";
import { User } from "src/app/modules/user/models/user.model";

export const loadUserList = createAction(
  '[User List] Load User List'
);

export const loadUserListSuccess = createAction(
  '[User List] User List Loaded Successful',
  props<{ users: User[] }>()
);

export const updateAffiliateData = createAction(
  '[User List] Update affiliate data',
  props<{ user: User }>()
);

export const addUser = createAction(
  '[User List] Add User',
  props<{ user: User }>()
);

export const removeUser = createAction(
  '[User List] Remove User',
  props<{ userId: string }>()
);