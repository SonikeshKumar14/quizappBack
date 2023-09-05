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
};

const Login = () => {
	const [state, setState] = useState(initState);
	const [message, setMessage] = useState('');
	const { username, password } = state;

	const dispatch = useDispatch();
	const history = useHistory();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			// Login api call
			const { data } = await axiosInstance.post('/auth/login', { username, password });
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
		<Container className='my-4 login-container'>
			<h1>Login</h1>
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

				<div style={{ color: 'red' }}>{message}</div>

				<Form.Group controlId='loginBtn' className='my-4'>
					<Button type='submit' className='px-5' disabled={!username || !password}>
						Login
					</Button>
				</Form.Group>
			</Form>
			<Row className='ml-0 py-3 d-block'>
				New User?
				<NavLink to='/register'>Register here!</NavLink>
			</Row>
		</Container>
	);
};

export default Login;
