import { useDispatch } from 'react-redux';
import Signup from './pages/Signup';
import './app.less';
import Home from './pages/Home';
import Login from './pages/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { getCurrentUser } from './action/auth.action';

function App() {
	const dispatch = useDispatch();
	const accessToken = localStorage.getItem('access_token');
	const refreshToken = localStorage.getItem('refresh_token');

	useEffect(() => {
		if (accessToken && refreshToken) {
			dispatch(getCurrentUser());
		}
	}, [dispatch, accessToken, refreshToken]);

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/signup' element={<Signup />} />
				<Route path='/login' element={<Login />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
