import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config();

const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_SMTP,
	port: 2525,
	secure: false,
	secureConnection: false,
	requireTLS: true,
	tls: {
		ciphers: 'SSLv3',
	},
	auth: {
		user: process.env.EMAIL_ID,
		pass: process.env.EMAIL_PASS,
	},
});

/**
 * Send a new email
 *
 * @param {string} to email address of the receiver
 * @param {string} subject subject of the email
 * @param {string} text text of the email
 */
export function sendEmail(to, subject, text) {
	const mailOptions = {
		from: {
			name: 'Shri Property',
			address: process.env.EMAIL_ID,
		},
		to,
		subject,
		text,
	};

	return transporter.sendMail(mailOptions);
}
