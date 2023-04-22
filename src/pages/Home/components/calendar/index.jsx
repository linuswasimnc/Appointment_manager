import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import CreateEventModal from '../createEventModal';
import './index.less';
import { useDispatch, useSelector } from 'react-redux';
import { getUserEvents } from '../../../../action/event.action';
import ViewEvent from './components/viewEventModal';

function AwesomeCalendar() {
	const dispatch = useDispatch();
	const { userEvents } = useSelector(state => state.events);
	const localizer = momentLocalizer(moment);
	const DnDCalendar = withDragAndDrop(Calendar);
	const [isCreateEventModalVisible, setIsCreateEventModalVisible] =
		useState(false);
	const [createdCalendarEvent, setCreatedCalendarEvent] = useState({});
	const [isViewEventModalVisible, setIsViewEventModalVisible] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState({});
	const [defaultView, setDefaultView] = useState(Views.WEEK);

	useEffect(() => {
		dispatch(getUserEvents());
	}, []);

	const selectSlotHandler = event => {
		setCreatedCalendarEvent(event);
		setIsCreateEventModalVisible(true);
	};

	const eventSelectHandler = event => {
		setSelectedEvent(event);
		setIsViewEventModalVisible(true);
	};

	return (
		<>
			<section className='h-screen'>
				<ViewEvent
					visible={isViewEventModalVisible}
					setVisible={setIsViewEventModalVisible}
					event={selectedEvent}
				/>
				<CreateEventModal
					visible={isCreateEventModalVisible}
					setVisible={setIsCreateEventModalVisible}
					event={createdCalendarEvent}
				/>
				<DnDCalendar
					localizer={localizer}
					defaultDate={new Date().toString()}
					events={userEvents}
					defaultView={defaultView}
					onView={view => setDefaultView(view)}
					onSelectSlot={selectSlotHandler}
					onSelectEvent={eventSelectHandler}
					eventPropGetter={(event, start, end, isSelected) => ({
						event,
						start,
						end,
						isSelected,
						style: {
							backgroundColor: event.type === 'block' ? '#002a4d' : '#40A9FF',
						},
					})}
					selectable
					popup
				/>
			</section>
		</>
	);
}

export default AwesomeCalendar;
