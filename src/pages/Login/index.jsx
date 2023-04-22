import { useState } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import ForgetPasswordModal from './components/ForgetPasswordModal';
import { postLogin } from '../../action/auth.action';
import { useDispatch } from 'react-redux';

function Login() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [loginLoading, setLoginLoading] = useState(false);
	const [form] = Form.useForm();
	const [isRequiredFieldMissing, setIsRequiredFieldMissing] = useState(true);
	const [forgetPasswordModalVisible, setForgetPasswordModalVisible] =
		useState(false);

	const validateMessage = {
		required: '${label} is required!',
		types: {
			email: '${label} is not a valid email!',
			number: '${label} is not a valid number!',
		},
	};

	const checkFieldValidation = () => {
		const missingRequiredField = Object.values(form.getFieldsValue()).some(
			field => field === undefined || field === '' || field === null
		);

		if (!missingRequiredField) setIsRequiredFieldMissing(false);
		else setIsRequiredFieldMissing(true);
	};

	const submitHandler = async values => {
		try {
			setLoginLoading(true);
			await dispatch(postLogin(values));
			message.success('Login Successful');
			navigate('/');
		} finally {
			setLoginLoading(false);
		}
	};

	return (
		<main className='p-10 flex items-center justify-center'>
			<ForgetPasswordModal
				isVisible={forgetPasswordModalVisible}
				setIsVisible={setForgetPasswordModalVisible}
			/>
			<section className='flex w-full justify-around items-center shadow-2xl p-10 rounded-lg max-w-screen-2xl min-h-[80vh]'>
				<div className='w-1/3 h-auto hidden md:block'>
					<img
						src='/images/auth/login.svg'
						alt='illustration'
						className='h-full w-full'
					/>
				</div>

				<div className='w-full md:w-1/2'>
					<Form
						validateMessages={validateMessage}
						layout='vertical'
						form={form}
						onFinish={submitHandler}
						onChange={checkFieldValidation}
					>
						<Form.Item
							label='Email'
							name='email'
							rules={[{ required: true, type: 'email' }]}
						>
							<Input placeholder='arpiitchugh@gmail.com' size='large' />
						</Form.Item>

						<Form.Item
							label='Password'
							name='password'
							rules={[{ required: true }]}
						>
							<Input.Password placeholder='strongpassword' size='large' />
						</Form.Item>
						<Typography.Paragraph className='text-center'>
							don't have an account?{' '}
							<Link to='/signup' className='underline-offset-2 !underline'>
								SignUp
							</Link>
						</Typography.Paragraph>
						<Typography.Paragraph className='text-center'>
							<Link
								to='#'
								className='text-blue-500'
								onClick={() => setForgetPasswordModalVisible(true)}
							>
								forgot password?
							</Link>
						</Typography.Paragraph>
						<Button
							type='primary'
							size='large'
							htmlType='submit'
							disabled={isRequiredFieldMissing}
							loading={loginLoading}
							className='w-full'
						>
							{loginLoading
								? 'Terraformer Logging in... 🚀'
								: 'Terraformer Login 👩‍🚀'}
						</Button>
					</Form>
				</div>
			</section>
		</main>
	);
}

export default Login;
