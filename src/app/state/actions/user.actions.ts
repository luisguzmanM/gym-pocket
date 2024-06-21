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

export const updateMembershipState = createAction(
  '[User List] Update Membership State',
  props<{ user: User }>()
);