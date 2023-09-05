const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const connectToDB = require('./server/helpers/connectToDB');
const api = require('./server/routes/api');

// Create express app
const app = express();

// Body parser to parse requests to JSON
app.use(express.json());

// CORS - allow requests from predefined origins
app.use(cors({ origin: 'http://localhost:3000' }));

// ROUTES
app.use('/api/v1', api);

// SERVER STATIC FILES
app.use(express.static(path.join(__dirname, 'client', 'build')));

// SERVE index.html file if any other resource is requested
app.get('*', (_, res) => {
	return res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'), function (err) {
		res.status(500).send(err);
	});
});

const PORT = process.env.PORT || 5000;

// Connect to mongoDb using mongoose
connectToDB()
	.then(() => {
		console.log('Connected to DATABASE...');
		// Start express server to accept http/https requests
		app.listen(PORT, () => console.log(`Express server running on port ${PORT}`));
	})
	.catch((err) => {
		console.log(err);
	});
