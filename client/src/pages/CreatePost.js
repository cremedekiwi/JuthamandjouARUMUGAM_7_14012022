import React, { useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik' // Pour les formulaires
import * as Yup from 'yup'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

function CreatePost() {

	let history = useHistory()

	// Initialise les champs
	const initialValues = {
		title: '',
		postText: '',
	}

	useEffect(() => {
		// Si accessToken est false (non login), on redirige vers la page login
		if (!localStorage.getItem('accessToken')) {
			history.push('/login')
		}
	}, [history])

	// Marche avec Formik, permet de créer des restrictions, ici string et champs requis
	const validationSchema = Yup.object().shape({
		title: Yup.string().required('Titre requis'),
		postText: Yup.string().required('Message requis'),
	})

	// Envoi les données du formulaire, data contient le body
	const onSubmit = (data) => {
		axios
			.post('http://localhost:3001/posts', data, {
				headers: { accessToken: localStorage.getItem('accessToken') }, // accessToken contient username
			})
			.then((response) => {
				history.push('/') // Redirige vers la page d'accueil
			})
	}

	return (
		// Conteneur
		<div className="createPostPage">
			<Formik
				// Valeurs initiales 
				initialValues={initialValues}
				// Fonctions à lancer au click
				onSubmit={onSubmit}
				// Mets des restrictions sur les champs
				validationSchema={validationSchema}
			>
				<Form className="formContainer">
					{/* Affiche les messages d'erreurs par rapport au titre */}
					<ErrorMessage name="title" component="span" />
					{/* Field = input */}
					<Field
						// Pour ne pas voir l'historique
						autoComplete="off"
						className="inputCreatePost"
						// Le même champ que sur la BDD
						name="title"
						// Décrit ce qu'on doit mettre
						placeholder="Titre"
					/>
					<ErrorMessage name="postText" component="span" />
					<Field
						autoComplete="off"
						className="inputCreatePost"
						name="postText"
						placeholder="Message"
					/>

					<button type="submit">Créer</button>
				</Form>
			</Formik>
		</div>
	)
}

export default CreatePost
