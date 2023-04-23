import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
	{
		title: { type: String },
		type: {
			type: String,
			required: true,
			default: 'appointment',
			enum: ['appointment', 'block'],
		},
		agenda: { type: String },
		start: { type: String, required: true },
		end: { type: String, required: true },
		guests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	},
	{
		timestamps: true,
	}
);

const EventModel = new mongoose.model('Event', eventSchema);

export default EventModel;
