import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faAward } from '@fortawesome/free-solid-svg-icons/faAward';
import axiosInstance from '../helpers/axiosInstance';
import useLoggedUser from '../helpers/useLoggedUser';

const Leaderboard = () => {
	useLoggedUser();
	const dispatch = useDispatch();
	const leaderboard = useSelector((store) => store.leaderboard);

	// GET LEADERBOARD
	// Get Leaderboard api call
	async function getLeaderboard() {
		try {
			const { data } = await axiosInstance.get('/leaderboard', {
				headers: {
					'Content-type': 'application/json',
					Authorization: `Bearer ${JSON.parse(localStorage.getItem('QZLY_USER')).token}`,
				},
			});
			console.log(data);
			if (data.response) {
				dispatch({
					type: 'SAVE_LEADERBOARD',
					payload: data.response,
				});
			}
		} catch (err) {
			// console.log(err);
			if (err?.response?.data?.response) {
				console.log(err.response.data.response);
			} else {
				console.log(err);
			}
		}
	}

	useEffect(() => {
		dispatch({
			type: 'RESET_ACTIVE_QUIZ',
		});
		if (!leaderboard) {
			getLeaderboard();
		}
		// eslint-disable-next-line
	}, []);

	if (!leaderboard) return <div>Loading...</div>;

	return (
		<Container className='mt-5 leaderboard-container'>
			<h1 className='text-center mb-5'>Leaderboard</h1>
			{leaderboard.map((leader, index) => (
				<Card key={leader._id} className='card-wrapper'>
					<div className='rank-user-wrapper'>
						<Card.Text as='h5' className='rank text-muted'>#{index + 1}</Card.Text>
						<Card.Text as='h5' className='username'>
							<FontAwesomeIcon icon={faUser} />
							{leader.user.username}
						</Card.Text>
					</div>
					<Card.Text as='h5' className='text-info points'>
						<FontAwesomeIcon icon={faAward} /> {leader.points} Points
					</Card.Text>
				</Card>
			))}
		</Container>
	);
};

export default Leaderboard;
