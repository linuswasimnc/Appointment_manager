import { ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

/**
 * Validate the body against the zod schema
 * @param {object} schema zod schema
 */
function validateRequest(schema) {
	return (req, res, next) => {
		try {
			schema.parse({
				body: req.body,
				query: req.query,
				params: req.params,
			});

			return next();
		} catch (err) {
			if (err instanceof ZodError) {
				switch (err.errors[0].code) {
					case 'invalid_string':
						res.status(StatusCodes.UNPROCESSABLE_ENTITY);
						break;

					case 'invalid_type':
						res.status(StatusCodes.BAD_REQUEST);
						break;

					case 'invalid_enum_value':
						res.status(StatusCodes.UNPROCESSABLE_ENTITY);
						break;

					case 'custom':
						res.status(StatusCodes.UNAUTHORIZED);
						break;

					default:
						res.status(StatusCodes.BAD_REQUEST);
						break;
				}

				return res.json({
					error: err.errors[0].message,
				});
			}

			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				error: 'Internal Server Error',
			});
		}
	};
}

export default validateRequest;
