import React, { useState, useContext } from 'react'
import { Formik, Form, ErrorMessage } from 'formik'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext'

function Login() {
	const initialValues = {
		username: '',
		password: '',
	}

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const { setAuthState } = useContext(AuthContext)

	let history = useHistory()

	const login = () => {
		const data = { username: username, password: password }
		axios.post('http://localhost:3001/auth/login', data).then((response) => {
			if (response.data.error) {
				alert(response.data.error)
			} else {
				localStorage.setItem('accessToken', response.data.token)
				setAuthState({
					username: response.data.username,
					id: response.data.id,
					status: true,
				})
				history.push('/')
			}
		})
	}
	return (
		<div className="centerRegister">
			<Formik initialValues={initialValues} onSubmit={login}>
				<Form className="formContainer">
					<ErrorMessage name="username" component="span" />
					<input
						type="text"
						placeholder="Pseudo"
						id="inputCreatePost"
						onChange={(event) => {
							setUsername(event.target.value)
						}}
					/>

					<ErrorMessage name="password" component="span" />
					<input
						type="password"
						placeholder="Mot de passe"
						id="inputCreatePost"
						onChange={(event) => {
							setPassword(event.target.value)
						}}
					/>

					<button type="submit">Login</button>
				</Form>
			</Formik>
		</div>
	)
}

export default Login
