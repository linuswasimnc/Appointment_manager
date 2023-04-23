import { z } from 'zod';

export const signupSchema = z.object({
	body: z
		.object({
			name: z
				.string({ required_error: 'Please enter your name' })
				.min(3, 'name must be at least 3 characters long')
				.max(20, 'name can not be longer than 20 characters'),
			email: z
				.string({ required_error: 'email is required' })
				.email('Please enter a valid email'),
			password: z
				.string({ required_error: 'password is required' })
				.min(6, 'Password is too short - should be 6 chars minimum.'),

			cpassword: z
				.string({ required_error: 'cpassword is required' })
				.min(6, 'Password is too short - should be 6 chars minimum.'),
		})
		.refine(data => data.password === data.cpassword, {
			message: 'Password and confirm password do not match',
			path: ['cpassword'],
		}),
});

export const verifyUserSchema = z.object({
	params: z.object({
		verificationCode: z.string({
			required_error: 'verificationCode is required',
		}),
		email: z
			.string({ required_error: 'email is required' })
			.email('Please enter a valid email'),
	}),
});

export const loginSchema = z.object({
	body: z.object({
		email: z
			.string({ required_error: 'Email is required' })
			.email('Invalid email or password'),
		password: z
			.string({ required_error: 'password is required' })
			.min(6, 'Invalid email or password'),
	}),
});

export const forgotPasswordSchema = z.object({
	body: z.object({
		email: z
			.string({ required_error: 'email is required' })
			.email('Please enter a valid email'),
	}),
});

export const resetPasswordSchema = z.object({
	params: z.object({
		email: z
			.string({ required_error: 'email is required' })
			.email('Please provide a valid email'),
		passwordResetCode: z.string({
			required_error: 'passwordResetCode is required',
		}),
	}),
	body: z
		.object({
			password: z
				.string({ required_error: 'password is required' })
				.min(4, 'password should be longer than 4 characters')
				.max(30, 'password can not be longer than 30 characters'),

			cpassword: z
				.string({ required_error: 'cpassword is required' })
				.min(4, 'password should be longer than 4 characters')
				.max(30, 'password can not be longer than 30 characters'),
		})
		.refine(data => data.password === data.cpassword, {
			message: 'Password and confirm password do not match',
			path: ['cpassword'],
		}),
});
