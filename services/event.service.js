import EventModel from '../model/events.model.js';

/**
 * create new event in database
 * @param {*} payload - payload to create new event
 */
export function createEventService(payload) {
	return EventModel.create(payload);
}

/**
 * Get all events from database
 * @param {object | undefined} query filter which will be used to get events
 */
export function getAllEventsService(query) {
	return EventModel.find(query || {});
}

/**
 * Get event by id from database
 * @param {*} id is the id of the event
 */
export function findEventById(id) {
	return EventModel.findById(id);
}
