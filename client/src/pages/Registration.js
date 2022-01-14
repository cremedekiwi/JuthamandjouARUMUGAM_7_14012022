import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'

function Registration() {
	const initialValues = {
		username: '',
		password: '',
	}

	const validationSchema = Yup.object().shape({
		username: Yup.string().min(3).max(15).required('Pseudo requis'),
		password: Yup.string().min(4).max(20).required('Mot de passe requis'),
	})

	const onSubmit = (data) => {
		axios.post('http://localhost:3001/auth', data).then(() => {
			console.log(data)
		})
	}

	return (
		<div className="centerRegister">
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				validationSchema={validationSchema}
			>
				<Form className="formContainer">
					<ErrorMessage name="username" component="span" />
					<Field
						autocomplete="off"
						id="inputCreatePost"
						name="username"
						placeholder="Pseudo"
					/>

					<ErrorMessage name="password" component="span" />
					<Field
						autocomplete="off"
						type="password"
						id="inputCreatePost"
						name="password"
						placeholder="Mot de passe"
					/>

					<button type="submit"> Créer nouveau compte</button>
				</Form>
			</Formik>
		</div>
	)
}

export default Registration
