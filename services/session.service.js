import SessionModel from '../model/session.model.js';

/**
 * Create a new session for user
 * @param {{userId}} userId of user for which refresh token should be created
 */
export function createSessionService({ userId }) {
	return SessionModel.create({ user: userId });
}

export function findSessionByIdService(id) {
	return SessionModel.findById(id);
}
