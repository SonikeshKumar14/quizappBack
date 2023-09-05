import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axiosInstance from './axiosInstance';

const useLoggedUser = () => {
	const reduxUser = useSelector((store) => store.user);
	const localUser = JSON.parse(localStorage.getItem('QZLY_USER'));
	const [user, setUser] = React.useState(null);

	const dispatch = useDispatch();
	const history = useHistory();

	// Get User by Id api call
	async function getUserById() {
		try {
			const { data } = await axiosInstance.get(`/user/${localUser.id}`, {
				headers: {
					'Content-type': 'application/json',
					Authorization: `Bearer ${JSON.parse(localStorage.getItem('QZLY_USER')).token}`,
				},
			});
			// console.log(data.response);
			if (data.response) {
				dispatch({
					type: 'SAVE_USER_DETAILS',
					payload: data.response,
				});
				localStorage.setItem(
					'QZLY_USER',
					JSON.stringify({
						id: data.response._id,
						token: data.response.token,
						...(data.response.role && { role: data.response.role }),
					})
				);
				setUser(data.response);
			}
		} catch (err) {
			console.log(err.response);
			// Navigate to /login
			history.push('/login');
		}
	}

	React.useEffect(() => {
		if (reduxUser?._id && reduxUser?.token) {
			setUser(reduxUser);
		} else if (localUser?.id && localUser?.token) {
			// get user from server
			// store to redux and return it
			getUserById();
		} else {
			// Navigate to /login
			history.push('/login');
		}
		// eslint-disable-next-line
	}, []);

	return { user, getUserById };
};

export default useLoggedUser;
