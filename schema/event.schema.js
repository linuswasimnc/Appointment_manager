import { z } from 'zod';

export const createEventSchema = z.object({
	body: z.object({
		type: z.enum(['appointment', 'block'], {
			required_error: 'type is required',
		}),
		title: z.string({ required_error: 'title is required' }),
		agenda: z.string({ required_error: 'agenda is required' }),
		start: z.string({ required_error: 'start is required' }),
		end: z.string({ required_error: 'end is required' }),
		guests: z
			.array(z.string({ required_error: 'guests is required' }))
			.optional(),
	}),
});

export const deleteEventSchema = z.object({
	params: z.object({
		id: z.string({ required_error: 'id is required' }),
	}),
});
