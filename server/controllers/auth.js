const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user');

// Generate json web token and sign it with secret token stored in env file
module.exports.generateJwtToken = (id) => {
	return jwt.sign({ id }, process.env.TOKEN_SECRET);
};

// Register a new user and store the doc in db
module.exports.register = async (req, res) => {
	try {
		const { username, password } = req.body || {};
		if (!username || !password) {
			return res.status(400).json({ message: 'Missing parameters!' });
		}
		// check if user already exist
		const _user = await User.findOne({ username });
		if (_user) {
			return res.status(400).json({ message: `${_user.username} already exist, Try another!` });
		}
		const user = await User.create({ username, password });

		// generate token
		const token = this.generateJwtToken(user._id);

		res.status(201).json({ response: { ...user.toObject(), password: undefined, token } });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ response: err.message });
	}
};

// Login user by verifying user credentials
module.exports.login = async (req, res) => {
	try {
		const { username, password } = req.body || {};
		if (!username || !password) {
			return res.status(400).json({ message: 'Missing parameters!' });
		}

		// validate user and password
		const user = await User.findOne({ username }).select('+password');
		if (!user || (user && !(await user.comparePassword(password, user.password)))) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		// generate token
		const token = this.generateJwtToken(user._id);

		res.status(200).json({ response: { ...user.toObject(), password: undefined, token } });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ response: err.message });
	}
};

// authenticate users by verifying auth token and user
module.exports.authenticate = async (req, res, next) => {
	try {
		const { authorization } = req.headers;
		let token;
		if (authorization && authorization.startsWith('Bearer')) {
			token = authorization.split(' ')[1];
		}
		if (!token || token === 'null' || token === 'undefined') {
			return res.status(401).json({ message: 'Please log in and try again!' });
		}
		const decodedToken = await promisify(jwt.verify)(token, process.env.TOKEN_SECRET);

		const decodedUser = await User.findById(decodedToken.id);
		if (!decodedUser) {
			return res.status(401).json({ message: "User doesn't exists, please log in again!" });
		}
		req.user = decodedUser;
		next();
	} catch (e) {
		console.log(e.message);
		return res.status(401).json({ message: 'Please log in and try again!' });
	}
};

// check if user have authorized role
module.exports.authorize = (role) => async (req, res, next) => {
	if (req.user.role.toUpperCase() !== role) {
		return res.status(403).json({ message: 'You are not authorized to do this!' });
	}
	next();
};
