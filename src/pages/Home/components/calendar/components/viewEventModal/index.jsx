import { useState } from 'react';
import { Button, List, message, Modal, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
	deleteEvent,
	getUserEvents,
} from '../../../../../../action/event.action';

function ViewEvent({ visible, setVisible, event }) {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const { currentUser } = useSelector(state => state.user);

	const deleteEventHandler = async () => {
		try {
			setLoading(true);
			await dispatch(deleteEvent(event._id));
			message.success('event deleted successfully');
			setVisible(false);
		} finally {
			dispatch(getUserEvents());
			setLoading(false);
		}
	};

	return (
		<Modal
			open={visible}
			title={event.title}
			closable
			onCancel={() => setVisible(false)}
			footer={null}
		>
			{event.type === 'appointment' ? (
				<>
					<div className='flex items-center mb-3'>
						<Typography.Title level={4} className='!m-0'>
							Title:
						</Typography.Title>
						<Typography.Title level={5} className='!m-0 !ml-3'>
							{event.title}
						</Typography.Title>
					</div>

					<div className='flex items-center mb-3'>
						<Typography.Title level={4} className='!m-0'>
							Agenda:
						</Typography.Title>
						<Typography.Paragraph className='!m-0 !ml-3'>
							{event.agenda}
						</Typography.Paragraph>
					</div>

					<div className='flex items-center mb-3'>
						<Typography.Title level={4} className='!m-0'>
							Organizer:
						</Typography.Title>
						<Typography.Paragraph className='!m-0 !ml-3'>
							{event?.organizer?.name}
						</Typography.Paragraph>
					</div>

					<div className='flex flex-col  justify-center mb-3'>
						<Typography.Title level={4} className='!m-0'>
							Guests:
						</Typography.Title>
						<List
							className='!m-0 !ml-3'
							dataSource={event.guests}
							renderItem={(guest, i) => (
								<List.Item>
									<Typography.Text>
										{`${i + 1})`} {guest?.name} {`<${guest?.email}>`}
									</Typography.Text>
								</List.Item>
							)}
						/>
					</div>
					{event?.organizer?.email === currentUser.email && (
						<Button
							danger
							loading={loading}
							type='ghost'
							onClick={deleteEventHandler}
						>
							delete event
						</Button>
					)}
				</>
			) : (
				<Button type='primary' onClick={deleteEventHandler} loading={loading}>
					Mark as Available
				</Button>
			)}
		</Modal>
	);
}

export default ViewEvent;
