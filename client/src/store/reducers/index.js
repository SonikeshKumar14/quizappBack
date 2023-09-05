import { combineReducers } from 'redux';
import leaderboardReducer from './leaderboardReducer';
import quizReducer from './quizReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
  user: userReducer,
  quiz: quizReducer,
  leaderboard: leaderboardReducer
});

export default rootReducer;
