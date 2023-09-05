const initialState = null;

const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SAVE_USER_DETAILS': {
			return { ...action.payload };
		}
		case 'RESET_USER_DETAILS': {
			return null;
		}
		default:
			return state;
	}
};

export default userReducer;
