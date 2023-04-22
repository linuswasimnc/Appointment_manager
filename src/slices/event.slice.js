import { createSlice } from '@reduxjs/toolkit';
import { replaceUserEvents } from '../reducers/event.reducer';

const initialState = {
	userEvents: [],
};

const eventsSlice = createSlice({
	name: 'events',
	initialState,
	reducers: {
		replaceUserEvents,
	},
});

export const eventsActions = eventsSlice.actions;
export default eventsSlice;
