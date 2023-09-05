const Leaderboard = require('../models/leaderboard');
const User = require('../models/user');

module.exports.getLeaderboard = async (req, res) => {
	try {
		const board = await Leaderboard.find({}).sort({ points: 'desc' });
		return res.status(200).json({ response: board });
	} catch (err) {
		console.log(err);
	}
};

/*

	check if user exists from user._id
	NO ==> return

	YES ==> check if user exist on leaderboard
			NO ==> create user doc on leaderboard
			YES ==> update user doc on leaderboard by incrementing points

*/

module.exports.updateLeaderboard = async (req, res) => {
	try {
		const { _id, points } = req.body;
		// check if user exists
		const user = await User.findById(_id);
		// console.log(user)
		if (!user) {
			const userFilter = { user: _id }
			const userEntry = await Leaderboard.findOne(userFilter);
			if (userEntry) {
				await Leaderboard.deleteOne(userFilter);
				console.log('Deleted non-existing user from leaderboard!');
			}
			return res.status(400).json({ message: 'User doesn`t exist, please try again!' });
		}

		// check if user added to leaderboard
		const userFilter = { user: _id }
		const userEntry = await Leaderboard.findOne(userFilter);
		// console.log(userEntry)
		if (!userEntry) {
			// create user entry on leaderboard and return leaderboard list
			const addedEntry = await Leaderboard.create({ user: _id, points });
			if (!addedEntry) throw new Error('Unable to add user to leaderboard!');
			console.log('User points added to leaderboard');
			const board = await Leaderboard.find({});
			return res.status(200).json({ response: board });
		}
		// update user points on leaderboard
		const updatedEntry = await Leaderboard.findOneAndUpdate(userFilter, { $inc: { points } }, { new: true, runValidators: true });
		if (!updatedEntry) throw new Error('Unable to update user points to leaderboard!');
		console.log('User points updated to leaderboard');
		this.getLeaderboard(req, res);
	} catch (err) {
		console.log(err);
	}
};
