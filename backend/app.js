const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv')
const morgan = require('morgan');
const helmet = require('helmet');
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express');


const AuthRouter = require('./routes/auth_router');
const ProfileRouter = require('./routes/profile_router');
const ServiceRouter = require('./routes/service_router');
const BookingRouter = require('./routes/booking_router');

require('colors')

dotenv.config();
// const routes = require('./routes');

const options = {
	definition : {
		openapi: "3.0.0",
		info: {
			title: "User Management API",
			version: "1.0.0",
			description: "API for managing Employees, HR, and Admins with role-based access.",
		},
		servers: [
			{
				url: process.env.BASE_URL || `http://localhost:${process.env.PORT}/api`,
			},
		],
	},
	apis: [
		"./routes/*.js",
		"./routes/project/*.js",
		"./routes/benefit/*.js",
	],
};
const specs = swaggerJsDoc(options);

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet()); // Adds basic security headers
app.use(morgan('common')); // Logs requests
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/doorstep?replicaSet=rs0")
  .then((url) => console.log(`MongoDB connected on ${url.connection.host}:${url.connection.port}/${url.connection.name}`.bgGreen))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', AuthRouter);
app.use('/api/profile', ProfileRouter);
app.use('/api/service', ServiceRouter);
app.use('/api/booking', BookingRouter);

module.exports = app;
