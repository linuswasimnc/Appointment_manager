import lodash from 'lodash';
import { userPrivateFields } from '../model/user.model.js';
import { signJWT } from '../utils/jwt.util.js';
import { createSessionService } from './session.service.js';

/**
 * Create a access token for user
 * @param user user which should be signed
 */
export function signAccessTokenService(user) {
	const payload = lodash.omit(user.toJSON(), userPrivateFields);

	return signJWT(payload, 'accessTokenPrivateKey', {
		expiresIn: '20mins',
	});
}

/**
 * Crete a refresh token for user
 * @param {{userId}} userId of user for which refresh token should be created
 */
export async function signRefreshTokenService({ userId }) {
	const session = await createSessionService({ userId });

	return signJWT(
		{
			session: session._id,
		},
		'refreshTokenPrivateKey',
		{ expiresIn: '30d' }
	);
}
