import { useState } from 'react';
import { Button, Container, Form, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
// import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import axiosInstance from '../helpers/axiosInstance';

// import FormContainer from '../../components/FormContainer';
// import Loader from '../../components/Loader';
// import Message from '../../components/Message';

const initState = {
	username: '',
	password: '',
	confirmPassword: '',
};

const Register = () => {
	const [state, setState] = useState(initState);
	const [message, setMessage] = useState('');
	const { username, password, confirmPassword } = state;

	const dispatch = useDispatch();
	const history = useHistory();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			return setMessage('Passwords must be same!');
		}
		try {
			// Register api call
			const { data } = await axiosInstance.post('/auth/register', { username, password });
			if (data.response && data.response._id && data.response.token) {
				setMessage('');
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
				history.push('/');
			}
		} catch (err) {
			console.log(err.response.data?.message);
			setMessage(err.response.data?.message);
		}
	};

	return (
		<Container className='my-4 register-container'>
			<h1>Register</h1>
			{/* {actionMessage && actionMessage.type === 'error' && <Message variant="danger">{actionMessage.message}</Message>} */}
			{/* {isLoading && <Loader />} */}
			<Form onSubmit={handleSubmit}>
				<Form.Group controlId='username' className='my-4'>
					<Form.Label>Username</Form.Label>
					<Form.Control
						type='username'
						placeholder='Enter username'
						value={username}
						onChange={(e) => setState({ ...state, username: e.target.value })}
					/>
				</Form.Group>

				<Form.Group controlId='password' className='my-4 mb-2'>
					<Form.Label>Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Enter password'
						value={password}
						onChange={(e) => setState({ ...state, password: e.target.value })}
					/>
				</Form.Group>

				<Form.Group controlId='confirm-password' className='my-4 mb-2'>
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Enter confirm password'
						value={confirmPassword}
						onChange={(e) => setState({ ...state, confirmPassword: e.target.value })}
					/>
				</Form.Group>

				<div style={{ color: 'red' }}>{message}</div>

				<Form.Group controlId='registerBtn' className='my-4'>
					<Button
						type='submit'
						className='px-5'
						disabled={!username || !password || !confirmPassword}
					>
						Register
					</Button>
				</Form.Group>
			</Form>
			<Row className='ml-0 py-3 d-block'>
				Already registered?
				<NavLink to='/login'>Login here!</NavLink>
			</Row>
		</Container>
	);
};

export default Register;
