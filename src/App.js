import React, { Component } from 'react'
import Layout from './hoc/Layout/Layout'
import { Route, Switch, withRouter } from 'react-router-dom'
import { Redirect } from 'react-router'
import Quiz from './containers/Quiz/Quiz'
import QuizList from './containers/QuizList/QuizList'
import Auth from './containers/Auth/Auth'
import QuizCreator from './containers/QuizCreator/QuizCreator'
import { connect } from 'react-redux'
import Logout from './components/Logout/Logout'
import { autoLogin } from './store/actions/auth'

class App extends Component {
	// when we enter the component
	componentDidMount() {
		this.props.autoLogin()
	}

	render() {
		// if user is not in the system
		let routes = (
			<Switch>
				{/* <Route path='/auth' component={Auth} />
				<Route path='/quiz/:id' component={Quiz} />
				<Route path='/' exact component={QuizList} /> */}
				<Route path='/auth' component={props => <Auth {...props} />} />
				<Route path='/quiz/:id' component={props => <Quiz {...props} />} />
				<Route path='/' exact component={props => <QuizList {...props} />} />
				<Redirect to={'/'} />
			</Switch>
		)

		// if user is in the system
		if (this.props.isAuthenticated) {
			routes = (
				<Switch>
					{/* <Route path='/quiz-creator' component={QuizCreator} />
					<Route path='/quiz/:id' component={Quiz} />
					<Route path='/logout' component={Logout} />
					<Route path='/' exact component={QuizList} /> */}
					<Route
						path='/quiz-creator'
						component={props => <QuizCreator {...props} />}
					/>
					<Route path='/quiz/:id' component={props => <Quiz {...props} />} />
					<Route path='/logout' component={props => <Logout {...props} />} />
					<Route path='/' exact component={props => <QuizList {...props} />} />
					<Redirect to={'/'} />
				</Switch>
			)
		}

		return <Layout>{routes}</Layout>
	}
}

function mapStateToProps(state) {
	return {
		isAuthenticated: !!state.auth.token // if token exists --> user is authenticated
	}
}

// automatically login to the system, allows to keep session opened if we have some valid data in localStorage
function mapDispatchToProps(dispatch) {
	return {
		autoLogin: () => dispatch(autoLogin())
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
