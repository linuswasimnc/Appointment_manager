import { verifyJWT } from '../utils/jwt.util.js';

/**
 * This function will be called before every route
 * and will deserialize the user from the cookie token
 * and attach it to the req.locals
 */
function deserializeUser(req, res, next) {
	const accessToken = (req.headers.authorization || '').replace(
		/^Bearer\s/,
		''
	);

	if (!accessToken) return next();

	const decoded = verifyJWT(accessToken, 'accessTokenPublicKey');

	res.locals.user = decoded || null;

	return next();
}

export default deserializeUser;
