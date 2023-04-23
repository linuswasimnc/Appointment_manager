import { StatusCodes } from 'http-status-codes';

function requireLogin(req, res, next) {
	const { user } = res.locals;

	if (!user)
		return res.status(StatusCodes.FORBIDDEN).json({
			error: 'Please login to continue',
		});

	return next();
}

export default requireLogin;
