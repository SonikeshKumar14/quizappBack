const express = require('express');
const { authenticate } = require('../controllers/auth');
const { validateUserAnswers, getUserById } = require('../controllers/user');

const router = express.Router();

/**
 * @description Allow only logged in users
 * @return throw 401 error if not logged in
 */
 router.use(authenticate);

/**
 * @description Get logged in user details by user id
 * @method GET
 * @api /user/:id
 */
 router.get('/:id', getUserById);

/**
 * @description Validate user answers
 * @method POST
 * @api /user/quiz/:id
 */
router.post('/quiz/:id', validateUserAnswers);

module.exports = router;
