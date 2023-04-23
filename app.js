import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';
import eventRouter from './routes/event.routes.js';
import userRouter from './routes/user.routes.js';
import deserializeUser from './middleware/deserializeUser.middleware.js';
import path from 'path';

config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use('/api', deserializeUser);
app.use('/api', authRouter);
app.use('/api', eventRouter);
app.use('/api', userRouter);

if (process.env.NODE_ENV === 'production') {
	app.use(
		express.static(
			path.resolve('..',
			'..',
			'Desktop',
			'Nbyula',
			'nbyula-appointment-manager-client',
			'public',
			'index.html')
		)
	);
	app.use('*', (req, res) => {
		res.sendFile(
			path.resolve(
				'..',
				'..',
				'Desktop',
				'Nbyula',
				'nbyula-appointment-manager-client',
				'public',
				'index.html'
			)
		);
		
	});
}




mongoose
  .connect("mongodb+srv://komedy:iamkomedy@cluster0.ozwmivj.mongodb.net/test", {
    useNewUrlParser: true, 

useUnifiedTopology: true  
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});