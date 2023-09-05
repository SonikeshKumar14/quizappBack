import { useSelector } from 'react-redux';
import { Button, Card, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons/faAnglesLeft';
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons/faAnglesRight';
import useLoggedUser from '../helpers/useLoggedUser';

const Rules = ({ history }) => {
	useLoggedUser();
	const { activeQuiz } = useSelector(store => store.quiz);

	if (!activeQuiz?._id) history.replace('/');

	const handleQuizStart = () => {
		history.push('/quiz/start/question');
	};

	return (
		<Container className='my-5 rules-container'>
			<Card className='p-5'>
				{!activeQuiz?._id ? (
					<>
						<Card.Text>Please select a quiz to get started</Card.Text>
						<Button variant='outline-dark' className='mt-0' onClick={() => history.push('/')}>
							&lt; Home
						</Button>
					</>
				) : (
					<>
						<Card.Title as='h1'>Quiz rules to be followed:</Card.Title>
						<Card.Body>
							<Card.Text>
								1. Click on <span className='font-weight-bold'>START</span> to start the quiz
							</Card.Text>
							<Card.Text>
								2. Once quiz is started, Do not{' '}
								<span className='font-weight-bold'>REFRESH/RELOAD</span> the page till you submit
								your answers
							</Card.Text>
							<Card.Text>
								3. In case of page reload, Quiz will be exited and you will be taken to Home page
							</Card.Text>
							<Card.Text>
								4. You can navigate back and front to answers different questions
							</Card.Text>
							<Card.Text>5. Once quiz is submitted, you will be shown your results</Card.Text>
						</Card.Body>
						<Card.Footer className='d-flex justify-content-between bg-white text-center'>
							<Button variant='outline-dark' onClick={() => history.push('/')}>
								<FontAwesomeIcon icon={faAnglesLeft} /> Home
							</Button>
							<Button onClick={handleQuizStart}>START <FontAwesomeIcon icon={faAnglesRight} /></Button>
						</Card.Footer>
					</>
				)}
			</Card>
		</Container>
	);
};

export default Rules;
