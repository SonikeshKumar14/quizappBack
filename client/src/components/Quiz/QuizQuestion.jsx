import React, { useEffect, useState } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons/faCircleQuestion';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons/faAnglesLeft';
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons/faAnglesRight';
import { faForward } from '@fortawesome/free-solid-svg-icons/faForward';

import axiosInstance from '../../helpers/axiosInstance';
import QuizResults from './QuizResults';
import useLoggedUser from '../../helpers/useLoggedUser';

const QuizQuestion = ({ history }) => {
	const { user, getUserById } = useLoggedUser() || {};
	const { _id: userId } = user || {};
	// Handle re-navigation when page is reloaded
	const {
		activeQuiz,
		activeQIndex,
		selectedOptions = [],
	} = useSelector((store) => store.quiz) || {};
	const { questions = [], numberOfQuestions = 0 } = activeQuiz || {};

	const [results, setResults] = useState();

	const dispatch = useDispatch();

	// POST LEADERBOARD
	// Update Leaderboard api call
	async function saveToLeaderboard(points) {
		try {
			const { data } = await axiosInstance.post(
				'/leaderboard',
				{ _id: userId, points },
				{
					headers: {
						'Content-type': 'application/json',
						Authorization: `Bearer ${JSON.parse(localStorage.getItem('QZLY_USER')).token}`,
					},
				}
			);
			// console.log(data);
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

	// Validate Answers api call
	async function validateAnswer() {
		try {
			const { data } = await axiosInstance.post(`/user/quiz/${activeQuiz._id}`, selectedOptions, {
				headers: {
					'Content-type': 'application/json',
					Authorization: `Bearer ${JSON.parse(localStorage.getItem('QZLY_USER')).token}`,
				},
			});
			console.log(data.response);
			if (data.response) {
				// Update user in redux
				getUserById();
				setResults(data.response);
			}
		} catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		if (!(Array.isArray(questions) && questions.length) && !results) {
			return history.replace('/');
		} else if (typeof results == 'object' && Array.isArray(questions) && questions.length) {
			dispatch({
				type: 'RESET_ACTIVE_QUIZ',
			});
			saveToLeaderboard(results.points);
		}
		// eslint-disable-next-line
	}, [questions, results]);

	const activeQ = questions[activeQIndex];
	const selectedOption = selectedOptions.find((q) => q.id === activeQ._id)?.selected;

	const handleSelectOption = (option) => {
		dispatch({
			type: 'UPDATE_SELECTED_QUESTIONS',
			payload: {
				id: activeQ._id,
				selected: option,
			},
		});
	};

	const handlePrevious = () => {
		dispatch({
			type: 'UPDATE_ACTIVE_QUESTION',
			payload: activeQIndex - 1,
		});
	};

	const handleNext = () => {
		if (questions.length - 1 !== activeQIndex) {
			dispatch({
				type: 'UPDATE_ACTIVE_QUESTION',
				payload: activeQIndex + 1,
			});
		} else {
			console.log('Submitting answers!');
			// console.log(selectedOptions)
			validateAnswer();
		}
	};

	if (!(Array.isArray(questions) && questions.length) && !results) return null;

	const LoadQuestions = () => (
		<Card className='p-3 question-card'>
			<Card.Header>
				Question {activeQIndex + 1} of {numberOfQuestions}
			</Card.Header>
			<Card.Title as='h2' className='text-black'>
				<FontAwesomeIcon icon={faCircleQuestion} /> {activeQ.text}
			</Card.Title>
			{activeQ.options.map((option, index) => (
				<Card
					key={index}
					className='p-3 my-2'
					role='button'
					data-selected={selectedOption === option}
					style={{
						background: selectedOption === option ? '#000' : '#fff',
						color: selectedOption === option ? '#fff' : '#000',
					}}
					onClick={() => handleSelectOption(option)}
				>
					{option}
				</Card>
			))}
			<Card.Footer className='d-flex justify-content-between bg-white text-center'>
				{activeQIndex !== 0 ? (
					<Button variant='outline-dark' onClick={handlePrevious}>
						<FontAwesomeIcon icon={faAnglesLeft} /> Previous
					</Button>
				) : (
					<div />
				)}
				<Button onClick={handleNext}>
					{questions.length - 1 === activeQIndex ? (
						<span>
							Submit <FontAwesomeIcon icon={faForward} style={{ marginLeft: '2px' }} />
						</span>
					) : (
						<span>
							Next <FontAwesomeIcon icon={faAnglesRight} />
						</span>
					)}
				</Button>
			</Card.Footer>
		</Card>
	);

	return (
		<Container className='quiz-question-container my-5'>
			{results ? <QuizResults results={results} /> : <LoadQuestions />}
		</Container>
	);
};

export default QuizQuestion;
