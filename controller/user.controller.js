import { StatusCodes } from 'http-status-codes';
import {
	findAllUsersService,
	findUserByIdAndUpdateService,
} from '../services/user.service.js';

export async function getAllUsersHandler(req, res) {
	try {
		const users = await findAllUsersService();

		return res.status(StatusCodes.OK).json({
			message: 'Users fetched successfully',
			records: users,
		});
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'Internal Server Error',
		});
	}
}

export async function patchUserName(req, res) {
	try {
		const { name } = req.body;

		const user = await findUserByIdAndUpdateService(res.locals.user._id, {
			name,
		});

		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({
				error: 'User not found',
			});
		}

		return res.status(StatusCodes.OK).json({
			message: 'User name updated successfully',
		});
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: 'Internal Server Error',
		});
	}
}
