import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';

export const userPrivateFields = [
	'password',
	'verificationCode',
	'passwordResetCode',
];

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		verificationCode: { type: String, required: true, default: () => nanoid() },
		passwordResetCode: { type: String, default: null },
		verified: { type: Boolean, default: false },
		events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
		blockedTime: [],
	},
	{ timestamps: true }
);

userSchema.pre('save', async function (next) {
	let user = this;

	if (!user.isModified('password')) {
		return next();
	}

	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hashSync(user.password, salt);
	user.password = hash;
	return next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
	const user = this;
	return bcrypt.compare(candidatePassword, user.password).catch(e => false);
};

const UserModel = new mongoose.model('User', userSchema);

export default UserModel;
