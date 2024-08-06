import { createReducer, on } from "@ngrx/store";
import { UserListState } from "src/app/modules/user/models/user.model";
import { loadUserList, loadUserListSuccess, updateAffiliateData, addUser, removeUser, logOut } from "../actions/user.actions";

export const initialState: UserListState = {
  loading: false,
  users: [],
};

export const userListReducer = createReducer(
  initialState,
  on(loadUserList, state => ({ ...state, loading: true })),
  on(loadUserListSuccess, (state, { users }) => ({ ...state, loading: false, users })),
  on(updateAffiliateData, (state, { user }) => ({ ...state, users: state.users.map(u => u.customerID === user.customerID ? user : u)})),
  on(addUser, (state, {user}) => ({...state, users: [user, ...state.users]})),
  on(removeUser, (state, {userId}) => ({...state, users: state.users.filter(user => user.customerID !== userId)})),
  on(logOut, () => initialState)
);