import { Router } from 'express';
import {
	getAllUsersHandler,
	patchUserName,
} from '../controller/user.controller.js';
import requireLogin from '../middleware/requireLogin.middleware.js';

const userRouter = Router();

userRouter
	.route('/users')
	.get(getAllUsersHandler)
	.patch(requireLogin, patchUserName);

export default userRouter;
