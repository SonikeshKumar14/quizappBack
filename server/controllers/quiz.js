const { Quiz } = require('../models/quiz');

module.exports.getAllQuizes = async (req, res) => {
	try {
		const quizes = await Quiz.find({});
		return res.status(200).json({ response: quizes });
	} catch (e) {
		console.log(e);
		return res.status(500).json({ response: e.message });
	}
};

module.exports.getQuizById = async (req, res) => {
	try {
		let selectStr = '-questions.answer';
		if (req.user && req.user.role === 'ADMIN') {
			selectStr = '';
		}
		const { id } = req.params;
		const quiz = await Quiz.findById(id).select(selectStr);
		return res.status(200).json({ response: quiz });
	} catch (e) {
		console.log(e);
	}
};

module.exports.getQuizAnswersById = async (req, res) => {
	try {
		const { id } = req.params;
		const quiz = await Quiz.findById(id);
		return res.status(200).json({ response: quiz });
	} catch (e) {
		console.log(e);
	}
};

module.exports.getQuizesByCategory = async (req, res) => {
	try {
		const { id: category } = req.params;
		const quizes = await Quiz.find({ category });
		return res.status(200).json({ response: quizes });
	} catch (e) {
		console.log(e);
	}
};

module.exports.createQuiz = async (req, res) => {
	try {
		const quiz = await Quiz.create(req.body);
		if (!quiz) throw new Error('Unable to create quiz');
		const quizes = await Quiz.find({});
		return res.status(201).json({ response: quizes });
		// return res.status(201).json({ response: quiz });
	} catch (err) {
		console.log(err.message);
		if (err && err.errors) {
			// ValidationError
			let errors = Object.values(err.errors).map((el) => el.message);
			console.log(errors.join('\n'));
			const message = errors.length > 0 ? errors.join('<br>') : errors[0];
			return res.status(400).json({ message });
		} else if (err && err.code === 11000 && err.keyValue) {
			// DuplicateError
			const [field, value] = Object.entries(err.keyValue)[0] || [];
			console.log(Object.entries(err.keyValue));
			const message = `${field} "${value}" already exists, Choose another title!`;
			console.log(message);
			return res.status(400).json({ message });
		}
		return res.status(500).json({ message: err.message });
	}
};

module.exports.deleteQuiz = async (req, res) => {
	try {
		const { id } = req.params;
		const quiz = await Quiz.findById(id);
		if (!quiz) {
			return res.status(400).json({ message: "Quiz doesn't exists" });
		}
		const deletedDoc = await Quiz.findOneAndDelete({ _id: id });
		if (!deletedDoc) throw new Error('Error occured while deleting the quiz!');
		return await this.getAllQuizes(req, res);
	} catch (e) {
		console.log(e);
		return res.status(500).json({ message: e.message });
	}
};

module.exports.updateQuiz = async (req, res) => {
	try {
		const { id } = req.params;
		const updateObj = req.body;
		if (updateObj?.questions?.length) {
			updateObj.numberOfQuestions = updateObj.questions.length;
		}
		const updatedDoc = await Quiz.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});
		// console.log(updatedDoc)
		if (!updatedDoc) throw new Error('Error occured while updating the quiz!');
		const quizes = await Quiz.find({});
		return res.status(201).json({ response: quizes });
	} catch (err) {
		console.log(err.message);
		if (err && err.errors) {
			// ValidationError
			let errors = Object.values(err.errors).map((el) => el.message);
			console.log(errors.join('\n'));
			const message = errors.length > 0 ? errors.join('<br>') : errors[0];
			return res.status(400).json({ message });
		} else if (err && err.code === 11000 && err.keyValue) {
			// DuplicateError
			const [field, value] = Object.entries(err.keyValue)[0] || [];
			console.log(Object.entries(err.keyValue));
			const message = `${field} "${value}" already exists, Choose another title!`;
			console.log(message);
			return res.status(400).json({ message });
		}
		return res.status(500).json({ message: err.message });
	}
};
