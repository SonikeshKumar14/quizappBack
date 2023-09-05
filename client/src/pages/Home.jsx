import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons/faCheckCircle';
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons/faAnglesRight';
import { faListOl } from '@fortawesome/free-solid-svg-icons/faListOl';
import { faAward } from '@fortawesome/free-solid-svg-icons/faAward';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons/faWandMagicSparkles';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';

import axiosInstance from '../helpers/axiosInstance';
import useLoggedUser from '../helpers/useLoggedUser';

const RenderUserActions = ({ quizId, completed, handleQuizAction }) => {
	const isCompleted = Array.isArray(completed) && completed.find((q) => q.id === quizId);
	return (
		<Button
			variant={isCompleted ? 'outline-primary' : 'primary'}
			className='w-100'
			onClick={() => handleQuizAction(quizId)}
			disabled={isCompleted}
		>
			{isCompleted ? (
				<span>
					Completed <FontAwesomeIcon icon={faCheckCircle} />{' '}
				</span>
			) : (
				<span>
					Attempt <FontAwesomeIcon icon={faAnglesRight} />{' '}
				</span>
			)}
		</Button>
	);
};

const Home = () => {
	const { user } = useLoggedUser() || {};
	const { role = '', completed = [] } = user || {};
	const { quizzes } = useSelector((store) => store.quiz) || {};
	const dispatch = useDispatch();
	const history = useHistory();

	useEffect(() => {
		dispatch({
			type: 'RESET_ACTIVE_QUIZ',
		});
		// eslint-disable-next-line
	}, []);

	// GET ALL QUIZZES
	// Get All Quizzes api call
	async function getQuizzes() {
		try {
			const { data } = await axiosInstance.get('/quiz', {
				headers: {
					'Content-type': 'application/json',
					Authorization: `Bearer ${JSON.parse(localStorage.getItem('QZLY_USER')).token}`,
				},
			});
			// console.log(data);
			if (data.response) {
				dispatch({
					type: 'SAVE_ALL_QUIZ',
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

	React.useEffect(() => {
		if (!quizzes) {
			getQuizzes();
		}
		// eslint-disable-next-line
	}, [quizzes]);

	// Get Quiz by Id api call
	async function getQuizById(id, action) {
		try {
			const { data } = await axiosInstance.get(`/quiz/${id}`, {
				headers: {
					'Content-type': 'application/json',
					Authorization: `Bearer ${JSON.parse(localStorage.getItem('QZLY_USER')).token}`,
				},
			});
			if (data.response) {
				if (action) {
					dispatch({
						type: 'TOGGLE_MODE',
						payload: action,
					});
					dispatch({
						type: 'SAVE_ACTIVE_QUIZ',
						payload: data.response,
					});
					if (action === 'EDIT') {
						return history.push('/quiz/new-update');
					}
				} else {
					dispatch({
						type: 'SAVE_ACTIVE_QUIZ',
						payload: data.response,
					});
					history.push('/quiz/rules');
				}
			}
		} catch (err) {
			console.log(err.message);
		}
	}

	const handleQuizAction = (id) => {
		getQuizById(id);
	};

	// Delte Quiz api call
	async function deleteQuizCall(id) {
		try {
			const { data } = await axiosInstance.delete(`/quiz/${id}`, {
				headers: {
					'Content-type': 'application/json',
					Authorization: `Bearer ${JSON.parse(localStorage.getItem('QZLY_USER')).token}`,
				},
			});
			if (data.response) {
				dispatch({
					type: 'SAVE_ALL_QUIZ',
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

	const handleDelete = (id) => {
		const shouldDelete = window.confirm('Do you want to delete this quiz?');
		if (shouldDelete) {
			// make delete api call
			deleteQuizCall(id);
		}
	};

	const handleEdit = (id) => {
		// navigate to /quiz/new-update
		getQuizById(id, 'EDIT');
	};

	return (
		<Container className='py-5 home-container'>
			<Row xs={1} md={2} xl={3} className='g-4'>
				{Array.isArray(quizzes) &&
					quizzes.map((quiz) => (
						<Col key={quiz._id}>
							<Card id={quiz._id} className='py-4 px-2 h-100'>
								<Card.Body>
									<Card.Title as='h3'>{quiz.title}</Card.Title>
									<Card.Text>
										<Badge pill bg='danger'>
											{quiz.category}
										</Badge>
									</Card.Text>
									<Card.Text className='font-italic'>
										<FontAwesomeIcon icon={faListOl} /> {quiz.numberOfQuestions} Questions
									</Card.Text>
									<Card.Text className='font-italic'>
										<FontAwesomeIcon icon={faAward} /> {quiz.totalPoints} points
									</Card.Text>
								</Card.Body>
								<Card.Footer className='p-2 bg-white border-none d-flex w-100 justify-content-around'>
									{role?.toUpperCase() === 'ADMIN' ? (
										<>
											<Button
												variant='outline-primary'
												className='w-40'
												onClick={() => handleEdit(quiz._id)}
											>
												Edit <FontAwesomeIcon icon={faWandMagicSparkles} />
											</Button>
											<Button
												variant='outline-danger'
												className='w-40'
												onClick={() => handleDelete(quiz._id)}
											>
												Delete <FontAwesomeIcon icon={faTrash} />
												{/* <FontAwesomeIcon icon='fa-trash' /> */}
											</Button>
										</>
									) : (
										<RenderUserActions
											quizId={quiz._id}
											completed={completed}
											handleQuizAction={handleQuizAction}
										/>
									)}
								</Card.Footer>
							</Card>
						</Col>
					))}
			</Row>
		</Container>
	);
};

export default Home;
