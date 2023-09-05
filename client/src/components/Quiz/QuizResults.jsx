import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons/faHouse';
import { faMedal } from '@fortawesome/free-solid-svg-icons/faMedal';
import resultsSVG from '../../assets/results.svg'

const QuizResults = ({ results }) => {
	return (
		<Card className='p-3 quiz-results-card text-center'>
			<Card.Header>
				<img src={resultsSVG} alt='quiz-results' />
			</Card.Header>
			<Card.Title as='h3'>Congratulations!!</Card.Title>
			<Card.Body>
				<div className='d-flex justify-content-center'>
					<div className='mr-3 pt-2 results-score'>
						<span>Your Score</span>
						<Card.Text as='h1' className='mb-3 text-black'>
							<span className='text-info'>{results.questions.filter(q => q.correct).length}</span>/{results.numberOfQuestions}
						</Card.Text>
					</div>
					<div className='pl-3 pt-2 results-points'>
						<span>Your Points</span>
						<Card.Text as='h1' className='mb-3 text-info'>
							{results.points}
						</Card.Text>
					</div>
				</div>
			</Card.Body>
			<Card.Footer>
				<Card.Text>
					See how you look on the{' '}
					<Button as={NavLink} to='/leaderboard'>
						Leaderboard <FontAwesomeIcon icon={faMedal} />
					</Button>
				</Card.Text>
				<Card.Text>
					Go{' '}
					<Button as={NavLink} to='/'>
						Home <FontAwesomeIcon icon={faHouse} />
					</Button>{' '}
					to participate in more quizzes
				</Card.Text>
			</Card.Footer>
		</Card>
	);
};

export default QuizResults;
