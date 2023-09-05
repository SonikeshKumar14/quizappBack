const express = require('express');
const { register, login } = require('../controllers/auth');

const router = express.Router();

/**
 * @description Register a new user
 * @method POST
 * @api /auth/register
 */
router.post('/register', register);

/**
 * @description Verify credentials and login
 * @method POST
 * @api /auth/login
 */
router.post('/login', login);

module.exports = router;
