import { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import propTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../../../action/user.action';
import { createEvent, getUserEvents } from '../../../../action/event.action';

function CreateEventModal({ visible, setVisible, event }) {
	const dispatch = useDispatch();
	const { allUsers, currentUser } = useSelector(state => state.user);
	const [form] = Form.useForm();

	const [selectedGuests, setSelectedGuests] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		dispatch(getAllUsers());
	}, [dispatch]);

	const submitHandler = async () => {
		try {
			setLoading(true);
			const values = form.getFieldsValue();
			await dispatch(
				createEvent({
					type: 'appointment',
					title: values.title,
					agenda: values.agenda,
					guests: selectedGuests,
					start: new Date(event.start).toString(),
					end: new Date(event.end).toString(),
				})
			);
			form.resetFields();
			setVisible(false);
		} finally {
			setSelectedGuests([]);
			setLoading(false);
			dispatch(getUserEvents());
		}
	};

	const blockTimeHandler = async () => {
		const values = form.getFieldsValue();
		console.log(values);
		if (values.title || values.agenda || selectedGuests.length > 0) {
			message.info('you dont have to give any values for blocking time');
		}
		setLoading(true);
		try {
			await dispatch(
				createEvent({
					type: 'block',
					title: 'Blocked Time',
					agenda: 'I am not available',
					start: new Date(event.start).toString(),
					end: new Date(event.end).toString(),
				})
			);
			setVisible(false);
		} finally {
			setLoading(false);
			dispatch(getUserEvents());
			setSelectedGuests([]);
			form.resetFields();
		}
	};

	return (
		<Modal
			open={visible}
			className='!pb-0'
			title='Enter Event Details'
			onCancel={() => {
				form.resetFields();
				setVisible(false);
			}}
			closable
			footer={
				<div className='flex justify-between'>
					<Button
						onClick={blockTimeHandler}
						type='ghost'
						danger
						loading={loading}
					>
						Block Time
					</Button>
					<div className='flex'>
						<Button
							onClick={() => {
								form.resetFields();
								setVisible(false);
							}}
							type='default'
						>
							cancel
						</Button>
						<Button onClick={submitHandler} type='primary' loading={loading}>
							ok
						</Button>
					</div>
				</div>
			}
		>
			<Form layout='vertical' form={form} onFinish={submitHandler}>
				<Form.Item label='Title' name='title' rules={[{ required: true }]}>
					<Input placeholder='Proposal for new project' />
				</Form.Item>
				<Form.Item label='Agenda' name='agenda' rules={[{ required: true }]}>
					<Input.TextArea
						placeholder='Detailed description of the event'
						rows={4}
					/>
				</Form.Item>
				<Form.Item label='Guests'>
					<Select
						mode='multiple'
						placeholder='Select guests'
						optionLabelProp='label'
						showSearch
						showArrow
						optionFilterProp='children'
						onChange={value => setSelectedGuests(value)}
					>
						{allUsers?.map(
							user =>
								user.email !== currentUser.email && (
									<Select.Option
										key={user._id}
										value={user._id}
										label={user.name}
									>
										{`${user.name} <${user.email}>`}
									</Select.Option>
								)
						)}
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
}

CreateEventModal.propTypes = {
	/**
	 * Whether the modal is visible or not
	 */
	visible: propTypes.bool.isRequired,

	/**
	 * Function which will update the `visible` state
	 */
	setVisible: propTypes.func.isRequired,

	/**
	 * Event provided by the calendar
	 */
	event: propTypes.object.isRequired,
};

export default CreateEventModal;
