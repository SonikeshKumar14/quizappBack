import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';

let middlewares = [];

const customisedLogger = createLogger({
	collapsed: true,
});

if (process.env.NODE_ENV !== 'production') {
	middlewares = [...middlewares, customisedLogger];
}

const enhancer = applyMiddleware(...middlewares);

const initialState = {
	user: null,
	quiz: {
		quizzes: null,
		activeQuiz: null,
		activeQIndex: 0,
		selectedOptions: [],
		mode: 'VIEW'
	},
	leaderboard: null,
};

const store = createStore(rootReducer, initialState, enhancer);

export default store;
