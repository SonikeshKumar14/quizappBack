const initialState = null;

const leaderboardReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SAVE_LEADERBOARD': {
			return action.payload;
		}
		default:
			return state;
	}
};

export default leaderboardReducer;
