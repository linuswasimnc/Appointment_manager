import { message } from 'antd';
import axios from 'axios';

const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	timeout: 4000,
});

api.interceptors.request.use(config => {
	const accessToken = localStorage.getItem('access_token');
	const refreshToken = localStorage.getItem('refresh_token');

	if (accessToken) {
		config.headers['Authorization'] = `Bearer ${accessToken}`;
	}

	if (refreshToken) {
		config.headers['x-refresh'] = refreshToken;
	}

	return config;
});

api.interceptors.response.use(
	res => {
		return Promise.resolve(res.data);
	},
	async err => {
		const accessToken = localStorage.getItem('access_token');
		const refreshToken = localStorage.getItem('refresh_token');
		if (err.response.status === 403 && accessToken && refreshToken) {
			const res = await api.get('/auth/refresh', {
				headers: {
					'x-refresh': refreshToken,
				},
			});

			if (res.access_token)
				localStorage.setItem('access_token', res.access_token);

			const response = await api(err.config);

			return Promise.resolve(response);
		}

		if (err.response.data) {
			message.error({
				content: err.response.data.error,
				duration: 2,
				key: 'error',
			});
			return Promise.reject(err.response.data);
		}
	}
);

export default api;
