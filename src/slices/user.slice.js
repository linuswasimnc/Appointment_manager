import { createSlice } from '@reduxjs/toolkit';
import { replaceAllUsers, replaceCurrentUser } from '../reducers/user.reducer';

const initialState = {
	currentUser: null,
	isLoggedIn: false,
	allUsers: [],
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		replaceAllUsers,
		replaceUser: replaceCurrentUser,
	},
});

export const userActions = userSlice.actions;
export default userSlice;
