const express = require('express');
const { authenticate, authorize } = require('../controllers/auth');
const {
	getAllQuizes,
	getQuizById,
	getQuizesByCategory,
	createQuiz,
	deleteQuiz,
	updateQuiz,
	getQuizAnswersById,
} = require('../controllers/quiz');

const router = express.Router();

/**
 * @description Allow only logged in users
 * @return throw 401 error if not logged in
 */
router.use(authenticate);

/**
 * @description Get all quizes
 * @method GET
 * @api /quiz
 */
router.get('/', getAllQuizes);

/**
 * @description Get quiz by category
 * @method GET
 * @api /quiz/category/:id
 */
router.get('/category/:id', getQuizesByCategory);

/**
 * @description Get quiz by id
 * @method GET
 * @api /quiz/:id
 */
router.get('/:id', getQuizById);

/**
 * @description Get complete quiz with answers
 * @method GET
 * @api /quiz/:id/answers
 */
router.get('/:id/answers', getQuizAnswersById);

/**
 * @description Allow only ADMIN to use these APIs
 * @return throw 403 error if not auhorized
 */
router.use(authorize('ADMIN'));

/**
 * @description Create new quiz
 * @method POST
 * @api /quiz
 */
router.post('/', createQuiz);

/**
 * @description Update quiz by Id
 * @method PUT
 * @api /quiz/:id
 */
router.put('/:id', updateQuiz);

/**
 * @description Delete quiz by Id
 * @method DELETE
 * @api /quiz/:id
 */
router.delete('/:id', deleteQuiz);

module.exports = router;
