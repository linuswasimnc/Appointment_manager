import { configureStore } from '@reduxjs/toolkit';
import eventsSlice from './slices/event.slice';
import userSlice from './slices/user.slice';

const store = configureStore({
	reducer: {
		user: userSlice.reducer,
		events: eventsSlice.reducer,
	},
});

export default store;
