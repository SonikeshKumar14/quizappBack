const mongoose = require('mongoose');

// Mongoose schema for Leaderboard
const mongooseSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
	},
	points: {
		type: Number,
        default: 0
	}
}, {
	toJSON: { versionKey: false }
});

mongooseSchema.pre(/^find/, function (next) {
	this.populate('user');
	next();
});

// Leaderboard Model
module.exports = mongoose.model('Leaderboard', mongooseSchema);
