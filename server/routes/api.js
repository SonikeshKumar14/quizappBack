const express = require('express');
const authRouter = require('./auth');
const userRouter = require('./user');
const quizRouter = require('./quiz');
const leaderboardRouter = require('./leaderboard');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);

router.use('/quiz', quizRouter);
router.use('/leaderboard', leaderboardRouter);

module.exports = router;
