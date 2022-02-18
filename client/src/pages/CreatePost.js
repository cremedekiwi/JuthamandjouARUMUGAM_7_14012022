import React, { useEffect, useState } from 'react'
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

	const [file, setFile] = useState(null);
	// const [postid, setPostid] = useState([]);

	// Envoi les données du formulaire, data contient le body
	const onSubmit = (data) => {
		const formData = new FormData() // Les données de l'image sont contenus dans formData
		formData.append('photo', file) // On ajoute le nom du fichier
		formData.append('title', data.title)
		formData.append('postText', data.postText)

		// Titre et corps du texte
		axios
			.post('http://localhost:3001/posts', formData, {
				headers: { accessToken: localStorage.getItem('accessToken') }, // accessToken contient username
				'content-type': 'multipart/form-data',
			})
			.then((response) => {
				history.push('/') // Redirige vers la page d'accueil
			})
			.catch((err) => {
				console.log('err', err);
			})
	}
	
	const onInputChange = (e) => {
		setFile(e.target.files[0]) // Met à jour le state avec le nom du fichier
	}

	return (
		// Conteneur
		<div className="createPostPage">
			<Formik
				// Valeurs initiales 
				initialValues={initialValues}
				// Mets des restrictions sur les champs
				validationSchema={validationSchema}
				// Lance la fonction onSubmit au click
				onSubmit={onSubmit}
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
					{/* input parcourir qui permet d'envoyer la photo au back */}
					<input type='file' name='photo' onChange={onInputChange} /> 
					<button type="submit">Publier</button>
				</Form>
			</Formik>
		</div>
	)
}

export default CreatePost
