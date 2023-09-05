import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Container, Dropdown, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons/faAnglesRight';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons/faCircleXmark';

import useLoggedUser from '../../helpers/useLoggedUser';
import { useHistory } from 'react-router-dom';
import axiosInstance from '../../helpers/axiosInstance';

const initState = {
	title: '',
	category: '',
	pointsPerQuestion: '20',
	questions: [
		{
			text: '',
			answer: '',
			options: ['', '', '', ''],
		}
	],
};

const RadioOptionLabel = ({ name, value, onChange }) => {
	return (
		<>
			<Form.Control type='text' size='sm' name={name} value={value} onChange={onChange} />
			<Form.Text className='text-danger'></Form.Text>
			{/* <Button className='bg-danger font-weight-bold'>X</Button> */}
		</>
	);
};

const RadioOption = ({ checked, qIndex, optionValue, handleRadioChange, handleOptionChange }) => (
	<>
		<Form.Check
			type='radio'
			label={<RadioOptionLabel value={optionValue} onChange={handleOptionChange} />}
			name={`options${qIndex}`}
			id='option1'
			onChange={handleRadioChange}
			checked={checked}
		/>
	</>
);

const CreateQuiz = () => {
	useLoggedUser();
	const [state, setState] = useState(initState);
	const [message, setMessage] = useState('');
	const { title, category, pointsPerQuestion, questions } = state;

	const dispatch = useDispatch();
	const history = useHistory();
	const { activeQuiz, mode } = useSelector((store) => store.quiz);

	useEffect(() => {
		if (mode === 'EDIT' && activeQuiz) {
			// set state from activeQuiz
			console.log(activeQuiz);
			const { title, category, pointsPerQuestion, questions } = activeQuiz;
			const editableQuiz = {
				title,
				category,
				pointsPerQuestion,
				questions: questions.map((q) => ({ ...q, answer: q.options.indexOf(q.answer) })),
			};
			setState(editableQuiz);
		}
		// eslint-disable-next-line
	}, []);

	// Create or Update Quiz api call
	async function createUpdateQuiz(payload) {
		try {
			setMessage('');
			const config = {
				method: 'POST',
				url: '/quiz',
			};
			if (mode === 'EDIT' && activeQuiz && activeQuiz._id) {
				config.method = 'PUT';
				config.url = `/quiz/${activeQuiz._id}`;
			}
			const _token = JSON.parse(localStorage.getItem('QZLY_USER'))?.token;
			if (!_token) history.replace('/login');
			const { data, status } = await axiosInstance({
				...config,
				data: payload,
				headers: {
					'Content-type': 'application/json',
					Authorization: `Bearer ${_token}`,
				},
			});
			if (data.response && status === 201) {
				dispatch({
					type: 'SAVE_ALL_QUIZ',
					payload: data.response,
				});
				history.push('/');
			}
		} catch (err) {
			// console.log(err);
			if (err?.response?.status === 403) {
				return history.replace('/');
			} else if (err?.response?.status === 401) {
				return history.replace('/login');
			}
			setMessage(err?.response?.data?.message);
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		const payload = {
			...state,
			questions: state.questions
				.filter((q) => q)
				.map((q) => ({ ...q, answer: q.options[q.answer] })),
		};
		console.log(payload);
		createUpdateQuiz(payload);
	};

	const handleAddQuestion = () => {
		const initQ = {
			text: '',
			answer: '',
			options: ['', '', '', ''],
		};
		setState({ ...state, questions: [...questions, initQ] });
	};

	const handleRemoveQuestion = (index) => {
		const { questions } = state;
		questions[index] = null;
		setState({ ...state, questions });
	};

	const handleQuestionTextChange = (e, qIndex) => {
		const { questions } = state;
		if (questions[qIndex]) {
			questions[qIndex].text = e.target.value;
		}
		setState({ ...state, questions });
	};

	const handleRadioChange = (qIndex, optIndex) => {
		const { questions } = state;
		if (questions[qIndex]) {
			questions[qIndex].answer = optIndex;
		}
		setState({ ...state, questions });
	};

	// question > options > option
	const handleOptionChange = (e, qIndex, optIndex) => {
		const { questions } = state;
		if (questions[qIndex] && questions[qIndex].options) {
			questions[qIndex].options[optIndex] = e.target.value;
		}
		setState({ ...state, questions });
	};

	const shouldEnableAdd = () => {
		const { title, category, pointsPerQuestion, questions } = state;
		if (
			title &&
			category &&
			+pointsPerQuestion >= 10 &&
			questions.length > 0 &&
			questions
				.filter((q) => q)
				.every((q) => q.text && (q.answer || q.answer === 0) && q.options.every((o) => o))
		) {
			return true;
		}
		return false;
	};

	return (
		<Container className='my-4 quiz-form-container'>
			<h1 className='text-black'>
				{mode === 'EDIT' && activeQuiz && activeQuiz._id ? 'Edit' : 'Create'} Quiz
			</h1>
			<Form onSubmit={handleSubmit} className='mb-5'>
				<Form.Group controlId='title' className='my-4'>
					<Form.Label>Title*</Form.Label>
					<Form.Control
						type='text'
						value={title}
						// size='sm'
						onChange={(e) => setState({ ...state, title: e.target.value })}
					/>
				</Form.Group>

				<Form.Group controlId='category' className='my-4'>
					<Form.Label>Category*</Form.Label>
					<Form.Control
						type='text'
						value={category}
						// size='sm'
						onChange={(e) => setState({ ...state, category: e.target.value })}
					/>
				</Form.Group>

				<Form.Group controlId='points-per-question' className='my-4'>
					<Form.Label>Point per each question* ({pointsPerQuestion})</Form.Label>
					<Form.Range
						min='10'
						max='100'
						step='10'
						title={pointsPerQuestion}
						value={pointsPerQuestion}
						onChange={(e) => setState({ ...state, pointsPerQuestion: e.target.value })}
					/>
					<Form.Text className='text-muted'>Points awarded for correct answer</Form.Text>
				</Form.Group>

				<Form.Group controlId='questions' className='my-4 mb-2'>
					<Form.Label as='h4' className='text-black'>
						Questions*
					</Form.Label>
					{questions.map((question, qIndex) => {
						if (!question) return null;
						return (
							<Card className='mb-3 p-2 border-none question-card' key={qIndex}>
								<Card.Body className=''>
									<Form.Label className='text-muted'>Question*</Form.Label>
									{state.questions.filter((q) => q).length > 1 && (
										<FontAwesomeIcon
											icon={faCircleXmark}
											style={{
												float: 'right',
												fontSize: '1.4rem',
												cursor: 'pointer',
												marginBottom: '15px',
											}}
											onClick={() => handleRemoveQuestion(qIndex)}
										/>
									)}
									<Form.Control
										type='text'
										size='sm'
										value={question.text}
										onChange={(e) => handleQuestionTextChange(e, qIndex)}
									/>
									<Form.Group controlId='options' className='my-4 mb-2'>
										<Form.Label className='text-muted'>
											Options* (Select one correct option)
										</Form.Label>
										{question.options.map((option, optIndex) => (
											<RadioOption
												key={optIndex}
												qIndex={qIndex}
												checked={questions[qIndex].answer === optIndex}
												handleRadioChange={() => handleRadioChange(qIndex, optIndex)}
												optionValue={option}
												handleOptionChange={(e) => handleOptionChange(e, qIndex, optIndex)}
											/>
										))}
									</Form.Group>
								</Card.Body>
							</Card>
						);
					})}
					<Form.Group controlId='addQBtn' className='my-1 text-right'>
						<Button
							className='bg-success'
							size='sm'
							onClick={handleAddQuestion}
							disabled={!shouldEnableAdd()}
						>
							Add Question
						</Button>
					</Form.Group>
				</Form.Group>

				<div style={{ color: 'red' }} dangerouslySetInnerHTML={{ __html: message }} />

				<Dropdown.Divider />

				<Form.Group controlId='createQuizBtn' className='mb-4'>
					<Button
						type='submit'
						className='px-5 submit-btn'
						// disabled={!username || !password || !confirmPassword}
						// disabled
					>
						{mode === 'EDIT' && activeQuiz && activeQuiz._id ? 'Update' : 'Add'} Quiz{' '}
						<FontAwesomeIcon icon={faAnglesRight} />
					</Button>
				</Form.Group>
			</Form>
		</Container>
	);
};

export default CreateQuiz;
