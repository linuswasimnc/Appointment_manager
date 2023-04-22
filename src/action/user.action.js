import { userActions } from '../slices/user.slice';
import api from '../util/api.util';
import { getCurrentUser, postLogin, refreshAccessToken } from './auth.action';

export function getAllUsers() {
	return async dispatch => {
		const res = await api.get('/users');
		dispatch(userActions.replaceAllUsers(res.records));
		return res;
	};
}

/**
 * Update name of current user
 * @param {string} name updated name
 */
export function updateUserName(name) {
	return async dispatch => {
		const res = await api.patch('/users', { name });
		dispatch(refreshAccessToken());
		return res;
	};
}
