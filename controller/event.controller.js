import { StatusCodes } from 'http-status-codes';
import {
	createEventService,
	findEventById,
} from '../services/event.service.js';
import {
	findUserByIdAndUpdateService,
	findUserByIdService,
} from '../services/user.service.js';
import { sendEmail } from '../utils/email.util.js';
import moment from 'moment';

export async function createEventHandler(req, res) {
	try {
		const { title, agenda, start, end, guests, type } = req.body;
		const formattedStartTime = moment(new Date(start)).format(
			'DD-MM-YYYY hh:mm A'
		);
		const formattedEndTime = moment(new Date(end)).format('DD-MM-YYYY hh:mm A');

		const user = await findUserByIdService(res.locals.user._id);

		if (guests && guests.length > 0) {
			for (let i = 0; i < guests.length; i++) {
				const guestUser = await findUserByIdService(guests[i]).populate(
					'events'
				);

				for (let j = 0; j < guestUser.events.length; j++) {
					const event = guestUser.events[j];

					if (event.type === 'block') {
						const isEventOverlapping =
							moment(new Date(start)).isBetween(
								new Date(event.start),
								new Date(event.end)
							) ||
							moment(new Date(end)).isBetween(
								new Date(event.start),
								new Date(event.end)
							);

						if (isEventOverlapping) {
							return res.status(StatusCodes.CONFLICT).json({
								error: `Event cannot be created as ${guestUser.name} is busy at that time`,
							});
						}
					}
				}
			}
		}

		const createdEvent = await createEventService({
			type,
			title,
			agenda,
			start: new Date(start).toString(),
			end: new Date(end).toString(),
			guests,
			organizer: user._id,
		});

		user.events.push(createdEvent._id);
		await user.save();

		if (guests && guests.length > 0) {
			guests.forEach(async guest => {
				const guestUser = await findUserByIdService(guests);

				guestUser.events.push(createdEvent._id);
				await guestUser.save();
				sendEmail(
					guestUser.email,
					`New Event with ${user.name}`,
					`You have been invited to a new event by ${user.name} from ${formattedStartTime} to ${formattedEndTime}`
				);
			});
		}

		return res.status(StatusCodes.CREATED).json({
			message: 'Event created successfully',
		});
	} catch (err) {
		console.log('====================================');
		console.log(err);
		console.log('====================================');
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'Internal Server Error',
		});
	}
}

export async function getEventForUserHandler(req, res) {
	try {
		const user = await findUserByIdService(res.locals.user._id);

		if (!user) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				error: 'Please login to view your events',
			});
		}

		const events = await Promise.all(
			user.events.map(async id => {
				return await findEventById(id).populate('organizer').populate('guests');
			})
		);

		return res.status(StatusCodes.OK).json({
			message: 'Events fetched successfully',
			records: events,
		});
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'Internal Server Error',
		});
	}
}

export async function deleteEventHandler(req, res) {
	try {
		const { id } = req.params;
		const event = await findEventById(id);
		const currentUser = res.locals.user._id;

		if (!event) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: 'Event not found',
			});
		}

		if (currentUser && currentUser !== event.organizer.toString()) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				error: 'Only organizer can delete the event',
			});
		}

		// delete event from guests
		event.guests.forEach(async guest => {
			await findUserByIdAndUpdateService(guest, {
				$pull: { events: event._id },
			});
		});

		// remove event from organizer
		const organizer = await findUserByIdService(event.organizer);

		await findUserByIdAndUpdateService(organizer._id, {
			$pull: { events: event._id },
		});

		await event.remove();

		return res.status(StatusCodes.OK).json({
			message: 'Event deleted successfully',
		});
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'Internal Server Error',
		});
	}
}
