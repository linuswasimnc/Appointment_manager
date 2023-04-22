import React, { useState } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import { useDispatch } from 'react-redux';
import {
	patchResetPassword,
	postForgotPassword,
} from '../../../../action/auth.action';

const ForgetPasswordModal = ({ isVisible, setIsVisible }) => {
	const dispatch = useDispatch();

	const [passwordResetCodeSent, setPasswordResetCodeSent] = useState(false);
	const [isRequiredFieldMissing, setIsRequiredFieldMissing] = useState(true);
	const [verifyAccountLoading, setVerifyAccountLoading] = useState(false);
	const [form] = Form.useForm();

	const validateFields = (form, setIsFieldsValidating) => {
		const missingRequiredField = Object.values(form.getFieldsValue()).some(
			value => value === '' || !value
		);

		setIsFieldsValidating(missingRequiredField);

		return missingRequiredField;
	};
	const sendVerificationEmail = async () => {
		try {
			const values = form.getFieldsValue();
			await dispatch(postForgotPassword({ email: values.email })).then(() => {
				message.success('Password reset code sent to email');
				setPasswordResetCodeSent(true);
			});
		} finally {
			setVerifyAccountLoading(false);
		}
	};

	const submitHandler = async () => {
		try {
			const values = form.getFieldsValue();

			await dispatch(
				patchResetPassword(
					{
						email: values.email,
						passwordResetCode: values.passwordResetCode,
					},
					{ password: values.password, cpassword: values.cpassword }
				)
			);

			setIsVisible(false);
			message.success('Password reset successfully');
		} finally {
			setVerifyAccountLoading(false);
		}
	};

	const cancelHandler = () => {
		form.resetFields();
		setIsVisible(false);
	};

	return (
		<Modal
			title='change password'
			open={isVisible}
			closable={false}
			destroyOnClose
			okText='Change Password'
			onCancel={cancelHandler}
			footer={
				<>
					<Button type='ghost' onClick={cancelHandler}>
						Cancel
					</Button>
					<Button
						type='primary'
						onClick={submitHandler}
						disabled={!passwordResetCodeSent}
					>
						Change Password
					</Button>
				</>
			}
		>
			<Form
				form={form}
				layout='vertical'
				onFinish={submitHandler}
				onChange={() => validateFields(form, setIsRequiredFieldMissing)}
			>
				<Form.Item
					label='Email'
					name='email'
					rules={[{ required: true, type: 'email' }]}
				>
					<div className='!flex !flex-row items-center'>
						<Input placeholder='arpiitchugh@gmail.com' size='large' />
						<Button
							type='primary'
							className='ml-2'
							onClick={sendVerificationEmail}
						>
							{passwordResetCodeSent ? 'Resend Code' : 'Send code'}
						</Button>
					</div>
				</Form.Item>

				<Form.Item
					label='Verification Code'
					name='passwordResetCode'
					rules={[
						{ required: true, message: 'Password reset code code is required' },
					]}
				>
					<Input placeholder='sent to email' />
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
			</Form>
		</Modal>
	);
};

export default ForgetPasswordModal;
