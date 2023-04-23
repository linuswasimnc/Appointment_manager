import UserModel from '../model/user.model.js';

/**
 * create new user in database
 * @param {*} payload - payload to create user
 */
export function createUserService(payload) {
	return UserModel.create(payload);
}

/**
 * Find a user from database with given email
 * @param email email of the user which will be used to find user
 */
export function findUserByEmailService(email) {
	return UserModel.findOne({ email });
}

/**
 * Find a user from database with given id
 * @param id id of the user which will be used to find user
 */
export function findUserByIdService(id) {
	return UserModel.findById(id);
}

/**
 * Find all users from database with given query
 *
 * @param {object | undefined} query filters which will be used to find users
 */
export function findAllUsersService(query) {
	return UserModel.find(query || {});
}

/**
 * Find a user from database with given id and update it
 * 
 * @param {*} id id of the user which will be used to find user
 * @param {*} payload payload which will be used to update user
 */
export function findUserByIdAndUpdateService(id, payload) {
	return UserModel.findByIdAndUpdate(id, payload, { new: true });
}
