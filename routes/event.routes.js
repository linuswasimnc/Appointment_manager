import { Router } from 'express';
import {
	createEventHandler,
	deleteEventHandler,
	getEventForUserHandler,
} from '../controller/event.controller.js';
import requireLogin from '../middleware/requireLogin.middleware.js';
import validateRequest from '../middleware/validateRequest.middleware.js';
import { createEventSchema } from '../schema/event.schema.js';

const eventRouter = Router();

eventRouter
	.route('/events')
	.post(requireLogin, validateRequest(createEventSchema), createEventHandler)
	.get(requireLogin, getEventForUserHandler);

eventRouter.delete('/events/:id', requireLogin, deleteEventHandler);

export default eventRouter;
