const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Mongoose schema for User
const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			unique: true,
			trim: true,
			required: [true, 'username is required'],
		},
		password: {
			type: String,
			select: false,
			required: [true, 'password is required'],
		},
		role: {
			type: String,
			enum: ['ADMIN', ''],
			default: '',
			select: true,
		},
		completed: [
			{
				id: {
					type: mongoose.Schema.ObjectId,
					ref: 'Quiz',
				},
				points: Number,
				questions: {
					type: [Object],
				},
			},
		],
	},
	{
		toJSON: { versionKey: false },
		toObject: { versionKey: false },
	}
);

// compare passwords during login without decrypting stored password
userSchema.methods.comparePassword = async function (password, actualPassword) {
	return await bcrypt.compare(password, actualPassword);
};

// Encrypt user's password before saving to database
userSchema.pre('save', function (next) {
	if (!this.isModified('password')) {
		return next();
	}
	const SALT_ROUNDS = 8;
	this.password = bcrypt.hashSync(this.password, SALT_ROUNDS);
	next();
});

// User Model
const User = mongoose.model('User', userSchema);

module.exports = User;
