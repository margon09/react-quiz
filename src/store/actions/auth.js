import axios from 'axios'
import { AUTH_SUCCESS, AUTH_LOGOUT } from './actionTypes'

export function auth(email, password, isLogin) {
	return async dispatch => {
		const authData = {
			email,
			password,
			returnSecureToken: true // firebase
		}

		// registration
		let url =
			'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyDWMTRIGRnTWabmWsfwEPaHJ4UJNf6Dgx8'

		// login
		if (isLogin) {
			url =
				'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDWMTRIGRnTWabmWsfwEPaHJ4UJNf6Dgx8'
		}

		const response = await axios.post(url, authData)
		const data = response.data

		// to support session in react-app we need the token that we got from server put into the localStorage so that we get access to it.
		// usually these tokens are for 1 hour/3600sec
		const expirationDate = new Date(
			new Date().getTime() + data.expiresIn * 1000
		)
		localStorage.setItem('token', data.idToken)
		localStorage.setItem('userId', data.localId)
		localStorage.setItem('expirationDate', expirationDate)

		dispatch(authSuccess(data.idToken))
		dispatch(autoLogout(data.expiresIn))
	}
}

export function autoLogout(time) {
	return dispatch => {
		setTimeout(() => {
			dispatch(logout())
		}, time * 1000)
	}
}

export function logout() {
	localStorage.removeItem('token')
	localStorage.removeItem('userId')
	localStorage.removeItem('expirationDate')
	return {
		type: AUTH_LOGOUT
	}
}

export function autoLogin() {
	return dispatch => {
		const token = localStorage.getItem('token')
		if (!token) {
			dispatch(logout())
		} else {
			const expirationDate = new Date(localStorage.getItem('expirationDate')) // check if token is valid now
			if (expirationDate <= new Date()) {
				dispatch(logout())
			} else {
				dispatch(authSuccess(token))
				dispatch(
					autoLogout((expirationDate.getTime() - new Date().getTime()) / 1000)
				)
			}
		}
	}
}

export function authSuccess(token) {
	return {
		type: AUTH_SUCCESS,
		token
	}
}
