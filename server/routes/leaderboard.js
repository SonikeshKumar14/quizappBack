const express = require('express');
const { getLeaderboard, updateLeaderboard } = require('../controllers/leaderboard');
const { authenticate } = require('../controllers/auth');

const router = express.Router();

/**
 * @description Allow only logged in users
 * @return throw 401 error if not logged in
 */
router.use(authenticate);

/**
 * @description Get leaderboard
 * @method GET
 * @api /leaderboard
 */
router.get('/', getLeaderboard);

/**
 * @description Update leaderboard
 * @method POST
 * @api /leaderboard
 */
router.post('/', updateLeaderboard);

module.exports = router;
