import React, { useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

function CreatePost() {

	let history = useHistory()
	const initialValues = {
		title: '',
		postText: '',
	}

	useEffect(() => {
		if (!localStorage.getItem('accessToken')) {
			history.push('/login')
		}
		// eslint-disable-next-line
	}, [])
	const validationSchema = Yup.object().shape({
		title: Yup.string().required('Titre requis'),
		postText: Yup.string().required('Contenu requis'),
	})

	const onSubmit = (data) => {
		axios
			.post('http://localhost:3001/posts', data, {
				headers: { accessToken: localStorage.getItem('accessToken') },
			})
			.then((response) => {
				history.push('/')
			})
	}

	return (
		<div className="createPostPage">
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				validationSchema={validationSchema}
			>
				<Form className="formContainer">
					<ErrorMessage name="title" component="span" />
					<Field
						autoComplete="off"
						id="inputCreatePost"
						name="title"
						placeholder="(Ex. Titre)"
					/>
					<ErrorMessage name="postText" component="span" />
					<Field
						autoComplete="off"
						id="inputCreatePost"
						name="postText"
						placeholder="(Ex. Post)"
					/>

					<button type="submit"> Create Post</button>
				</Form>
			</Formik>
		</div>
	)
}

export default CreatePost
