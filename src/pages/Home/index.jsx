import React, { useEffect, useState } from 'react';
import { Button, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getLogoutUser } from '../../action/auth.action';
import AwesomeCalendar from './components/calendar';
import ForgetPasswordModal from '../Login/components/ForgetPasswordModal';
import { updateUserName } from '../../action/user.action';

const { Title } = Typography;
const Home = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { currentUser, isLoggedIn } = useSelector(state => state.user);
	const [logoutLoading, setLogoutLoading] = useState(false);
	const [changePasswordModalVisible, setChangePasswordModalVisible] =
		useState(false);
	const accessToken = localStorage.getItem('access_token');
	const refreshToken = localStorage.getItem('refresh_token');

	useEffect(() => {
		if (!isLoggedIn && !accessToken && !refreshToken) navigate('/login');
	}, [dispatch, isLoggedIn, navigate, accessToken, refreshToken]);

	const logoutHandler = async () => {
		try {
			setLogoutLoading(true);
			await dispatch(getLogoutUser());
			localStorage.clear();
			navigate('/login');
		} finally {
			setLogoutLoading(false);
		}
	};

	const nameChangeHandler = async name => {
		await dispatch(updateUserName(name));
	};

	return (
		<>
			<section className='m-5'>
				<ForgetPasswordModal
					isVisible={changePasswordModalVisible}
					setIsVisible={setChangePasswordModalVisible}
				/>
				<div className='flex justify-between mt-5'>
					{isLoggedIn ? (
						<>
							<div>
								<Title level={3}>Hi</Title>
								<Title
									editable={{
										tooltip: 'click to edit your name',
										onChange: nameChangeHandler,
									}}
									level={4}
								>
									{currentUser?.name}!!!
								</Title>
							</div>
							<div className='flex'>
								<Button
									type='primary'
									className='mr-2'
									onClick={() => setChangePasswordModalVisible(true)}
								>
									change password
								</Button>
								<Button
									type='primary'
									onClick={logoutHandler}
									loading={logoutLoading}
								>
									Logout
								</Button>
							</div>
						</>
					) : (
						<>
							<Title level={2}>Terraformer 🌍</Title>
							<Button type='primary' loading={logoutLoading}>
								<Link to='/login'>Login</Link>
							</Button>
							<Button type='primary' loading={logoutLoading}>
								<Link to='/signup'>Signup</Link>
							</Button>
						</>
					)}
				</div>
				{isLoggedIn && <AwesomeCalendar />}
			</section>
		</>
	);
};

export default Home;
