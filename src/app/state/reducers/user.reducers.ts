// Reducer
import { createReducer, on } from "@ngrx/store";
import { UserListState } from "src/app/modules/user/models/user.model";
import { loadUserList, loadUserListSuccess, updateMembershipState } from "../actions/user.actions";

export const initialState: UserListState = {
  loading: false,
  users: [],
};

export const userListReducer = createReducer(
  initialState, 
  on(loadUserList, state => ({ ...state, loading: true })),
  on(loadUserListSuccess, (state, { users }) => ({ ...state, loading: false, users })),
  on(updateMembershipState, (state, { user }) => ({ ...state, users: state.users.map(u => u.userID === user.userID ? user : u)}))
);