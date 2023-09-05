import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, NavLink } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons/faHouse';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons/faCirclePlus';
import { faMedal } from '@fortawesome/free-solid-svg-icons/faMedal';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons/faArrowRightFromBracket';

const Header = () => {
	const location = useLocation();
	const history = useHistory();

	const { _id, role = '' } = useSelector((store) => store.user || {});
	const dispatch = useDispatch();

	const handleLogout = () => {
		dispatch({
			type: 'RESET_USER_DETAILS',
		});
		localStorage.removeItem('QZLY_USER');
		history.push('/login');
	};

	return (
		<header>
			<Navbar bg='black' variant='dark' expand='md' collapseOnSelect className='navbar'>
				<Container className='p-0'>
					<LinkContainer to='/'>
						<Navbar.Brand>
							<span className='text-warning'>Quiz</span>ly
						</Navbar.Brand>
					</LinkContainer>
					<Navbar.Toggle aria-controls='basic-navbar-nav' />
					<Navbar.Collapse id='basic-navbar-nav' className=''>
						{_id ? (
							<Nav className='justify-content-end' style={{ flex: 1 }}>
								<LinkContainer exact to='/'>
									<Nav.Link active={location.pathname === '/'}>
										<span>Home</span>{' '}
										<FontAwesomeIcon icon={faHouse} style={{ marginLeft: '5px' }} />
									</Nav.Link>
								</LinkContainer>
								{role?.toUpperCase() === 'ADMIN' && (
									<LinkContainer exact to='/quiz/new-update'>
										<Nav.Link active={location.pathname === '/quiz/new-update'}>
											Create Quiz <FontAwesomeIcon icon={faCirclePlus} />
										</Nav.Link>
									</LinkContainer>
								)}
								<LinkContainer exact to='/leaderboard'>
									<Nav.Link active={location.pathname === '/leaderboard'}>
										<span>Leaderboard</span>
										<FontAwesomeIcon icon={faMedal} style={{ marginLeft: '5px' }} />
									</Nav.Link>
								</LinkContainer>
								<NavLink onClick={handleLogout}>
									Logout{' '}
									<FontAwesomeIcon icon={faArrowRightFromBracket} style={{ marginLeft: '5px' }} />
								</NavLink>
							</Nav>
						) : (
							<Nav className='justify-content-end' style={{ flex: 1 }}>
								<LinkContainer to='/login' style={{ marginRight: '0.5rem' }}>
									<Nav.Link active={location.pathname === '/login'}>Login</Nav.Link>
								</LinkContainer>
								<LinkContainer to='/register'>
									<Nav.Link active={location.pathname === '/register'}>Register</Nav.Link>
								</LinkContainer>
							</Nav>
						)}
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	);
};

export default Header;
