import api from '../util/api.util';
import { userActions } from '../slices/user.slice';

export function postSignup(body) {
	return async () => {
		try {
			const res = await api.post('/auth/signup', body);
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	};
}

export function postLogin(body) {
	return async dispatch => {
		try {
			const res = await api.post('/auth/login', body);
			localStorage.setItem('access_token', res.access_token);
			localStorage.setItem('refresh_token', res.refresh_token);
			dispatch(getCurrentUser());
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	};
}

export function getVerifyAccount(pathParams) {
	return async () => {
		try {
			const res = await api.get(
				`/auth/verify/${pathParams.email}/${pathParams.verificationCode}`
			);
			Promise.resolve(res);
		} catch (err) {
			Promise.reject(err);
		}
	};
}

export function postForgotPassword(body) {
	return async () => {
		try {
			const res = await api.post('/auth/forgotpassword', body);
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	};
}

export function patchResetPassword(pathParams, body) {
	return async () => {
		try {
			const res = await api.patch(
				`/auth/resetpassword/${pathParams.email}/${pathParams.passwordResetCode}`,
				body
			);
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	};
}

export function getCurrentUser() {
	return async dispatch => {
		try {
			const accessToken = localStorage.getItem('access_token');

			const res = await api.get('/auth/me', {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (res.user) {
				dispatch(
					userActions.replaceUser({ currentUser: res.user, isLoggedIn: true })
				);
			} else {
				dispatch(
					userActions.replaceUser({ currentUser: null, isLoggedIn: false })
				);
			}

			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	};
}

export function getLogoutUser() {
	return async () => {
		try {
			const res = await api.get('/auth/logout');

			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');

			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	};
}

export function refreshAccessToken() {
	return async dispatch => {
		const accessToken = localStorage.getItem('access_token');
		const refreshToken = localStorage.getItem('refresh_token');

		try {
			if (accessToken && refreshAccessToken()) {
				const res = await api.get('/auth/refresh', {
					headers: {
						'x-refresh': refreshToken,
					},
				});

				if (res.access_token)
					localStorage.setItem('access_token', res.access_token);

				dispatch(getCurrentUser());
			}
		} catch (err) {
			return Promise.reject(err);
		}
	};
}
