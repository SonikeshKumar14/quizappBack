const initialState = {
	quizzes: null,
	activeQuiz: null,
	mode: 'VIEW',
	activeQIndex: 0,
	selectedOptions: []
};

const quizReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case 'SAVE_ALL_QUIZ': {
			return { ...state, quizzes: payload, activeQuiz: null, activeQIndex: 0, selectedOptions: [] };
		}
		case 'SAVE_ACTIVE_QUIZ': {
			return { ...state, activeQuiz: payload, activeQIndex: 0 };
		}
		case 'UPDATE_ACTIVE_QUESTION': {
			return { ...state, activeQIndex: payload };
		}
		case 'UPDATE_SELECTED_QUESTIONS': {
			const options = state.selectedOptions;
			const index = options?.findIndex(q => q.id === payload.id)
			if (index >= 0) {
				options[index].selected = payload.selected;
			} else {
				options.push({ ...payload })
			}
			return {  ...state, selectedOptions: options }
		}
		case 'RESET_ACTIVE_QUIZ': {
			return { ...state, activeQuiz: null, activeQIndex: 0, selectedOptions: [], mode: 'VIEW' };
		}
		case 'TOGGLE_MODE': {
			return { ...state, mode: payload };
		}
		default:
			return state;
	}
};

export default quizReducer;
