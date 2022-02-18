import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

function Registration() {
	const initialValues = {
		username: '',
		password: '',
	}

	const validationSchema = Yup.object().shape({
		username: Yup.string().min(3, '3 caractères minimum').max(15, '15 caractères minimum').required('Pseudo requis'),
		password: Yup.string().min(4, '4 caractères minimun').max(20, '20 caractères minimum').required('Mot de passe requis'),
	})

	let history = useHistory()

	// Envoi les données puis redirige vers la page login après la création de compte
	const onSubmit = (data) => {
		axios.post('http://localhost:3001/auth', data).then(() => {
			history.push('/login')
		})
	}

	return (
		<div className="centerVertical">
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				validationSchema={validationSchema}
			>
				<Form className="formContainer">
					<ErrorMessage name="username" component="span" />
					<Field
						autoComplete="off"
						className="inputCreatePost"
						name="username"
						placeholder="Pseudo"
					/>

					<ErrorMessage name="password" component="span" />
					<Field
						autoComplete="off"
						type="password"
						className="inputCreatePost"
						name="password"
						placeholder="Mot de passe"
					/>

					<button type="submit">Inscription</button>
				</Form>
			</Formik>
		</div>
	)
}

export default Registration
