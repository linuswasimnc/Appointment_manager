import { useState } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import { getVerifyAccount } from '../../../../action/auth.action';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function VerifyAccountModal({ isVisible, setIsVisible, email }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();

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

	const submitHandler = async () => {
		try {
			const values = form.getFieldsValue();
			await dispatch(
				getVerifyAccount({ email, verificationCode: values.verificationCode })
			);
			message.success('Account created successfully');
			setIsVisible(false);
			navigate('/login');
		} finally {
			setVerifyAccountLoading(false);
		}
	};

	return (
		<Modal
			title='Verify Your Account!'
			open={isVisible}
			closable={false}
			destroyOnClose
			centered
			footer={
				<Button
					type='primary'
					disabled={isRequiredFieldMissing}
					loading={verifyAccountLoading}
					onClick={submitHandler}
				>
					OK
				</Button>
			}
		>
			<Form
				form={form}
				onFinish={submitHandler}
				onChange={() => validateFields(form, setIsRequiredFieldMissing)}
			>
				<Form.Item
					label='Verification Code'
					name='verificationCode'
					rules={[{ required: true, message: 'Verification code is required' }]}
				>
					<Input placeholder='sent to email' />
				</Form.Item>
			</Form>
		</Modal>
	);
}

export default VerifyAccountModal;
