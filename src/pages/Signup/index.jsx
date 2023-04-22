import { React, useState } from 'react';
import { Button, Form, Input, message, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { postSignup } from '../../action/auth.action';
import VerifyAccountModal from './components/verifyAccountModal';
import { Link } from 'react-router-dom';

const Signup = () => {
	const dispatch = useDispatch();
	const [isRequiredFieldMissing, setIsRequiredFieldMissing] = useState(true);
	const [isVerificationModalVisible, setIsVerificationModalVisible] =
		useState(false);
	const [userEmail, setUserEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();

	const submitHandler = async values => {
		setLoading(true);
		try {
			await dispatch(postSignup(values));
			setUserEmail(values.email);
			setIsVerificationModalVisible(true);
		} finally {
			setLoading(false);
		}
	};
	const checkFieldValidation = () => {
		const missingRequiredField = Object.values(form.getFieldsValue()).some(
			field => field === undefined || field === ''
		);

		if (!missingRequiredField) setIsRequiredFieldMissing(false);
		else setIsRequiredFieldMissing(true);
	};
	const validateMessage = {
		required: '${label} is required!',
		types: {
			email: '${label} is not a valid email!',
		},
	};
	return (
		<main className='p-10 flex items-center justify-center'>
			<VerifyAccountModal
				isVisible={isVerificationModalVisible}
				setIsVisible={setIsVerificationModalVisible}
				email={userEmail}
			/>

			<section className='flex w-full justify-around items-center shadow-2xl p-10 rounded-lg max-w-screen-2xl min-h-[80vh]'>
				<div className='w-1/3 h-auto hidden md:block'>
					<img
						src='/images/auth/signup.svg'
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
						<Form.Item label='Name' name='name' rules={[{ required: true }]}>
							<Input placeholder='Arpit Chugh' size='large' />
						</Form.Item>

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

						<Form.Item
							label='Confirm Password'
							name='cpassword'
							rules={[
								{ required: true },
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!value || getFieldValue('password') === value) {
											return Promise.resolve();
										}
										return Promise.reject(
											new Error('Password and confirm password do not match')
										);
									},
								}),
							]}
							dependencies={['password']}
						>
							<Input.Password placeholder='strongpassword' size='large' />
						</Form.Item>
						<Typography.Paragraph className='text-center'>
							already have an account?
							<Link
								to='/login'
								className='text-blue-500 !underline underline-offset-2'
							>
								login
							</Link>
						</Typography.Paragraph>
						<Button
							type='primary'
							size='large'
							htmlType='submit'
							disabled={isRequiredFieldMissing}
							loading={loading}
							className='w-full px-5'
						>
							{loading ? 'terraformers ready to assemble... 🚀' : 'Signup 📝'}
						</Button>
					</Form>
				</div>
			</section>
		</main>
	);
};

export default Signup;
