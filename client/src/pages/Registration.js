import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik' // formik permet de gérer les formulaires
import * as Yup from 'yup' // yup permet de contrôler les champs
import axios from 'axios'
import { useHistory } from 'react-router-dom' // Redirection

function Registration() {
	const initialValues = {
		username: '',
		password: '',
	}

	const validationSchema = Yup.object().shape({ // On contrôle le nombre de caractère et on dit que c'est des champs requis
		username: Yup.string().min(3, '3 caractères minimum').max(15, '15 caractères minimum').required('Pseudo requis'),
		password: Yup.string().min(4, '4 caractères minimun').max(20, '20 caractères minimum').required('Mot de passe requis'),
	})

	let history = useHistory()

	// Envoi les données puis redirige vers la page login après la création de compte
	const onSubmit = (data) => {
		axios.post('http://localhost:3001/auth', data).then((response) => {
			if (response.data.error) {
				alert(response.data.error)
			} else {
				history.push('/login')
			}
		})
	}

	return (
		<div className="centerVertical">
			<Formik
				initialValues={initialValues} // Valeurs initiales du formulaire
				onSubmit={onSubmit} // Fonction à lancer au submit
				validationSchema={validationSchema} // Vérification des champs
			>
				<Form className="formContainer">
					{/* Message d'erreur */}
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
