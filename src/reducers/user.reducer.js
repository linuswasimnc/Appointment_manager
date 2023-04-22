/**
 * Accepts a array of all users as payload
 */
export function replaceAllUsers(state, action) {
	state.allUsers = action.payload;
}

/**
 * Takes a user object as payload and replace current user
 */
export function replaceCurrentUser(state, action) {
	state.currentUser = action.payload.currentUser;
	state.isLoggedIn = action.payload.isLoggedIn;
}
