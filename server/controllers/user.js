const User = require('../models/user');
const { Quiz } = require('../models/quiz');
const Leaderboard = require('../models/leaderboard');
const { generateJwtToken } = require('./auth');

module.exports.validateUserAnswers = async (req, res) => {
	try {
		// check if user exists
		const { _id: userId } = req.user;
		const { id: quizId } = req.params;
		const userQuestions = req.body || [];

		if (!userId || !Array.isArray(userQuestions)) {
			return res.status(400).json({ message: 'Missing parameters!' });
		}
		// get quiz by id
		const quiz = await Quiz.findById(quizId);
		if (!quiz) {
			return res.status(400).json({ message: 'Quiz doesn`t exist!' });
		}
		// verify user answers with actual answers
		const { questions = [], numberOfQuestions } = quiz || {};
		let points = 0;
		const _validatedQs = userQuestions.map((question) => {
			const { _id, text, answer } = questions.find((q) => q._id.toString() === question.id) || {};
			if (_id && answer && question && question.selected === answer) {
				points += quiz.pointsPerQuestion;
				return { _id, text, selected: question.selected, answer, correct: true };
			}
			return { _id, text, selected: question.selected, answer, correct: false };
		});

		//  update completed array in user object
		// completed doc => quizId, user answers
		const user = await User.findById(userId);
		if (user) {
			if (!user.completed.find((q) => q.id.toString() === quiz._id.toString())) {
				user.completed.push({
					id: quiz._id,
					questions: _validatedQs,
					points,
				});
			}
			await user.save();
		}

		// return quiz data, user question & answers, gained points back to client
		res.status(200).json({
			response: {
				id: quiz._id,
				questions: _validatedQs,
				numberOfQuestions,
				points,
			},
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

module.exports.getUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			throw new Error('User not found, please login again');
		}

		const token = generateJwtToken(user._id);

		res.status(200).json({ response: { ...user.toObject(), token } });
	} catch (err) {
		return res.status(400).json({ message: err.message });
	}
};
