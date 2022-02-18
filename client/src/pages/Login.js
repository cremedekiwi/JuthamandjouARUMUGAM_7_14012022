import React, { useState, useContext } from 'react'
import { Formik, Form, ErrorMessage } from 'formik'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext'

function Login() {
	// Valeurs initiales du formulaire
	const initialValues = {
		username: '',
		password: '',
	}


	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const { setAuthState } = useContext(AuthContext) // Récupère le setState depuis App.js avec useContext

	let history = useHistory()

	const login = () => {
		const data = { username: username, password: password }
		axios.post('http://localhost:3001/auth/login', data).then((response) => {
			// Affiche une alerte si il y a une erreur
			if (response.data.error) {
				alert(response.data.error)
			} else {
				// Récupère les infos depuis routes/Users quand on se login
				localStorage.setItem('accessToken', response.data.token) // Crée le token dans le localStorage
				// authState met à jour ton username, id et status
				setAuthState({
					username: response.data.username,
					id: response.data.id,
					status: true,
					isAdmin: response.data.isAdmin,
				})
				history.push('/') // Redirige vers la page des posts
			}
		})
	}
	
	return (
		<div className="centerVertical">
			<Formik initialValues={initialValues} onSubmit={login}>
				<Form className="formContainer">
					<ErrorMessage name="username" component="span" />
					<input
						type="text"
						placeholder="Pseudo"
						className="inputCreatePost"
						// Modifie le state avec la valeur du form
						onChange={(event) => {
							setUsername(event.target.value)
						}}
					/>

					<ErrorMessage name="password" component="span" />
					<input
						type="password"
						placeholder="Mot de passe"
						className="inputCreatePost"
						onChange={(event) => {
							setPassword(event.target.value)
						}}
					/>

					<button type="submit">Connexion</button>
				</Form>
			</Formik>
		</div>
	)
}

export default Login
