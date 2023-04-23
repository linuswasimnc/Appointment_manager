import { StatusCodes } from 'http-status-codes';
import {
	signAccessTokenService,
	signRefreshTokenService,
} from '../services/auth.service.js';
import {
	createUserService,
	findUserByEmailService,
	findUserByIdService,
} from '../services/user.service.js';
import { sendEmail } from '../utils/email.util.js';
import { verifyJWT } from '../utils/jwt.util.js';
import { findSessionByIdService } from '../services/session.service.js';
import { nanoid } from 'nanoid';

export async function signupHandler(req, res) {
	const { name, email, password } = req.body;
	try {
		// NOTE: password will be hashed in pre-middleware of user model
		const createdUser = await createUserService({ name, email, password });

		sendEmail(
			email,
			'Verification code for nbyula appointment manager',
			`Your verification code is ${createdUser.verificationCode}`
		);

		return res.status(StatusCodes.CREATED).json({
			message: 'User created and email sent successfully',
		});
	} catch (err) {
		if (err.code === 11000) {
			return res
				.status(StatusCodes.CONFLICT)
				.json({ error: 'user with same email already exists' });
		}
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: 'Internal Server Error' });
	}
}

export async function verifyUserHandler(req, res) {
	const { email, verificationCode } = req.params;

	try {
		const user = await findUserByEmailService(email);

		if (!user) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ error: 'user with given email not found' });
		}

		if (user.verified) {
			return res.status(StatusCodes.OK).json({
				message: 'User already verified',
			});
		}

		if (user.verificationCode !== verificationCode) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				error: 'Invalid verification code',
			});
		}

		user.verified = true;
		await user.save();

		return res.status(StatusCodes.OK).json({
			message: 'User verified successfully',
		});
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'Internal Server Error',
		});
	}
}

export async function loginHandler(req, res) {
	try {
		const { email, password } = req.body;

		const user = await findUserByEmailService(email);

		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: 'User not found',
			});
		}

		// check if user is verified
		// if (!user.verified) {
		// 	return res.status(StatusCodes.FORBIDDEN).json({
		// 		error: 'Please verify your email',
		// 	});
		// }

		// check if password is correct
		const isPasswordValid = await user.comparePassword(password);

		if (!isPasswordValid) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				error: 'Invalid credentials',
			});
		}

		// sign access token
		const accessToken = signAccessTokenService(user);

		const refreshToken = await signRefreshTokenService({ userId: user._id });

		return res.status(StatusCodes.OK).json({
			message: 'User logged in successfully',
			access_token: accessToken,
			refresh_token: refreshToken,
		});
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'Internal Server Error',
		});
	}
}

export async function logoutHandler(req, res) {
	try {
		const refreshToken = req.headers['x-refresh'];

		const decoded = verifyJWT(refreshToken, 'refreshTokenPublicKey');

		if (!decoded) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				error: 'Invalid refresh token',
			});
		}

		const session = await findSessionByIdService(decoded.session);

		if (!session || !session.valid) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				error: 'Session is not valid',
			});
		}

		session.valid = false;

		await session.save();

		res.status(StatusCodes.OK).json({
			message: 'User logged out successfully',
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

export function getCurrentUserHandler(req, res) {
	const { user } = res.locals;

	if (!user) {
		return res.status(StatusCodes.FORBIDDEN).json({
			error: 'User is not logged in',
		});
	}

	return res.status(StatusCodes.OK).json({
		message: user ? 'User logged in successfully' : 'User not logged in',
		user: user || null,
	});
}

export async function forgotPasswordHandler(req, res) {
	const { email } = req.body;

	try {
		const user = await findUserByEmailService(email);

		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: 'User not found please check if your email is correct',
			});
		}

		if (!user.verified) {
			return res.status(StatusCodes.FORBIDDEN).json({
				error: 'User is not verified',
			});
		}

		const passwordResetCode = nanoid();

		user.passwordResetCode = passwordResetCode;

		await user.save();

		sendEmail(
			email,
			'Password Reset Verification Code',
			`Your verification code is:- ${passwordResetCode}`
		);

		return res.status(StatusCodes.OK).json({
			message: 'Password verification code sent successfully to your email',
		});
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'Internal Server Error',
		});
	}
}

export async function resetPasswordHandler(req, res) {
	const { email, passwordResetCode } = req.params;
	const { password } = req.body;

	try {
		const user = await findUserByEmailService(email);

		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: 'User not found',
			});
		}

		if (
			!user?.passwordResetCode ||
			user?.passwordResetCode !== passwordResetCode
		) {
			return res.status(StatusCodes.FORBIDDEN).json({
				error: 'Invalid password reset code',
			});
		}

		user.passwordResetCode = null;
		user.password = password;
		await user.save();

		return res.status(StatusCodes.OK).json({
			message: 'Password reset successfully',
		});
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'Internal Server Error',
		});
	}
}

export async function refreshAccessTokenHandler(req, res) {
	try {
		const refreshToken = req.headers['x-refresh'];

		const decoded = verifyJWT(refreshToken, 'refreshTokenPublicKey');

		if (!decoded) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				error: 'Invalid refresh token',
			});
		}

		const session = await findSessionByIdService(decoded.session);
		if (!session || !session.valid) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				error: 'Session is not valid',
			});
		}

		const user = await findUserByIdService(session.user.toString());

		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: 'User not found',
			});
		}

		const accessToken = signAccessTokenService(user);

		return res.status(StatusCodes.OK).json({
			access_token: accessToken,
		});
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'Internal Server Error',
		});
	}
}
