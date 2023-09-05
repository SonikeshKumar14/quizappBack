const mongoose = require('mongoose');
const { isUniqueArray } = require('../helpers');

const questionSchema = new mongoose.Schema({
	text: {
		type: String,
		required: [true, 'Question text is required!'],
	},
	options: {
		type: [String],
		required: true,
		validate: function () {
			if (this?.options?.length <= 1) {
				throw new Error('Question must have atleast 2 options!');
			} else if (!this?.options?.every((opt) => opt || opt === 0)) {
				throw new Error('Option must not be empty!');
			} else if (!isUniqueArray(this?.options)) {
				throw new Error('Question must have unique options!');
			}
		},
	},
	answer: {
		type: String,
		required: [true, 'Question answer is required!'],
	},
});
const Question = mongoose.model('Question', questionSchema);

// Mongoose schema for Quiz
const quizSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			unique: true,
			trim: true,
			required: [true, 'Quiz title is required!'],
		},
		category: {
			type: String,
			required: [true, 'Quiz category is required!'],
		},
		pointsPerQuestion: {
			type: Number,
			default: 50,
			validate: function () {
				if (this?.pointsPerQuestion < 10 || this?.pointsPerQuestion > 100) {
					throw new Error('Points must between 10 and 100!');
				}
			},
		},
		numberOfQuestions: {
			type: Number,
			default: function () {
				return this.parent()?.questions?.length || 0;
			},
		},
		questions: {
			type: [questionSchema],
			required: true,
			validate: function () {
				if (this?.questions?.length <= 0) {
					throw new Error('Quiz must have atleast 1 question!');
				} else if (!isUniqueArray(this?.questions?.map((q) => q.text))) {
					throw new Error('Quiz must have unique questions!');
				}
			},
		},
	},
	{ toJSON: { versionKey: false, virtuals: true }, id: false }
);

// Virtual property on document that is not stored to database
quizSchema.virtual('totalPoints').get(function () {
	return this.numberOfQuestions * this.pointsPerQuestion;
});

quizSchema.pre(/^find$/, function (next) {
	this.select('-questions');
	next();
});

// Quiz Model
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = {
	Question,
	Quiz,
};
