import 'bootswatch/dist/lux/bootstrap.min.css';
// import 'bootswatch/dist/sketchy/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './common/Header';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import Login from './components/Login';
import Register from './components/Register';
import Rules from './pages/Rules';
import QuizQuestion from './components/Quiz/QuizQuestion';
import CreateQuiz from './components/Quiz/CreateQuiz';

const App = () => {
	return (
		<BrowserRouter>
			<Header />
			<Switch>
				<Route path='/' exact component={Home} />
				<Route path='/login' component={Login} />
				<Route path='/register' component={Register} />
				<Route path='/quiz/rules' component={Rules} />
				<Route path='/quiz/start/question' component={QuizQuestion} />
				<Route path='/quiz/new-update' component={CreateQuiz} />
				<Route path='/leaderboard' exact component={Leaderboard} />
			</Switch>
		</BrowserRouter>
	);
};

export default App;
