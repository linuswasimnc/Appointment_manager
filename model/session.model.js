import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		valid: { type: Boolean, default: true },
		expireAt: { type: Date, default: Date.now, index: { expires: '15d' } },
	},
	{ timestamps: true }
);

const SessionModel = new mongoose.model('Session', sessionSchema);

export default SessionModel;
