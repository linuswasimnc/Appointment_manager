import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

config();

/**
 * Create a jwt token
 *
 * @param {*} payload is the payload to be signed
 * @param {"accessTokenPrivateKey" | "refreshTokenPrivateKey"} keyName is key which should be used to sign jwt
 * @param {object} options options options for jwt.sign
 */
export function signJWT(payload, keyName, options) {
	const privateKey =
		keyName === 'accessTokenPrivateKey'
			? process.env.ACCESS_TOKEN_PRIVATE_KEY
			: process.env.REFRESH_TOKEN_PRIVATE_KEY;

	return jwt.sign(payload, privateKey, {
		...(options && options),
		algorithm: 'RS256',
	});
}

/**
 * Verify a jwt token
 *
 * @param {string} token is the token to be verified
 * @param {"accessTokenPublicKey" | "refreshTokenPublicKey"} keyName which key will be used to decode token
 */
export function verifyJWT(token, keyName) {
	const publicKey =
		keyName === 'accessTokenPublicKey'
			? process.env.ACCESS_TOKEN_PUBLIC_KEY
			: process.env.REFRESH_TOKEN_PUBLIC_KEY;

	try {
		return jwt.verify(token, publicKey);
	} catch (err) {
		return null;
	}
}
