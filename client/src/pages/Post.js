/* eslint eqeqeq: "off", curly: "error" */

import React, { useEffect, useState, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../helpers/AuthContext' 
import DeleteIcon from '@mui/icons-material/Delete'

function Post() {
	let { id } = useParams() // Permet de récupérer l'id dans l'URL
	const [postObject, setPostObject] = useState({}) // state du post
	const [comments, setComments] = useState([]) // state du commentaire
	const [newComment, setNewComment] = useState('') // state du commentaire qu'on écrit
	const { authState } = useContext(AuthContext) // Permet d'utiliser des variables entre les routes

	let history = useHistory()

	// Se lance quand on render la page
	useEffect(() => {
		// Récupère un post grâce à l'id
		axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
			setPostObject(response.data)
		})

		// Récupères les commentaires lié à un post
		axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
			setComments(response.data)
		})
		
	}, [id])

	// Ajoute un commentaire
	const addComment = () => {
		if (newComment != "") {
		axios
			.post(
				'http://localhost:3001/comments',
				{
					// rajouter le nouveau commentaire et l'id du post au body
					commentBody: newComment,
					PostId: id,
				},
				{
					headers: {
						accessToken: localStorage.getItem('accessToken'), // Ajoute accessToken au header
					},
				}
			)
			.then((response) => {
				if (response.data.error) {
					console.log(response.data.error)
				} else {
					// Objet qui contient le nouveau commentaire : avec le commentBody, username et id
					const commentToAdd = {
						commentBody: response.data.commentBody,
						username: response.data.username,
						id: response.data.id,
					}
					setComments([...comments, commentToAdd]) // Récupère les anciens commentaire, et rajoute le nouveau
					setNewComment('') // Réinitialise l'input à ""
				}
			})
		}
	}

	// Supprime un commentaire, prend id en paramètre
	const deleteComment = (id) => {
		axios
			.delete(`http://localhost:3001/comments/${id}`, { // On rajoute id dans la requête axios
				headers: { accessToken: localStorage.getItem('accessToken') }, // On passe accessToken dans le header
			})
			.then(() => {
				// Filtre les commentaires pour récupérer ceux différent de notre id
				setComments(
					comments.filter((val) => {
						return val.id != id
					})
				)
			})
	}

	// Supprime un post avec id
	const deletePost = (id) => {
		axios
			.delete(`http://localhost:3001/posts/${id}`, {
				headers: { accessToken: localStorage.getItem('accessToken') },
			})
			.then(() => {
				history.push('/')
			})
	}

	// Modifie
	const editPost = (option) => {
		// Modifie le titre
		if (option === 'title') {
			// Variable qui contient le prompt titre
			let newTitle = prompt('Nouveau titre :')
			// Empêche que le titre soit null
			if (newTitle != undefined && newTitle != "") {
				axios.put(
					'http://localhost:3001/posts/title',
					{
						// Body
						newTitle: newTitle,
						id: id,
					},
					{
						headers: { accessToken: localStorage.getItem('accessToken') },
					}
				)
				
					setPostObject({ ...postObject, title: newTitle }) // On garde postObject et on change uniquement title
			}
		}
		// Modifie le corps du post
		else {
			// Variable qui contient le prompt  du nouveau texte
			let newPostText = prompt('Nouveau texte :')
			// Empêche que le post soit null
			if (newPostText != undefined && newPostText != "") {
				axios.put(
					'http://localhost:3001/posts/postText',
					{
						// Body
						newText: newPostText,
						id: id,
					},
					{
						headers: { accessToken: localStorage.getItem('accessToken') },
					}
				)

					setPostObject({ ...postObject, postText: newPostText }) // On garde postObject et on change uniquement postText
			}
		}
	}

	return (
		<div className="postPage">
			{/* Côté gauche : post */}
			<div className="leftSide">
				<div className="post" id="individual">
					{/* Titre, au click on peut le modifier */}
					<div
						className="title"
						onClick={() => {
							// Uniquement la personne qui a crée le post peut le titre
							if (authState.username === postObject.username) {
								editPost('title')
							}
						}}
					>
						{postObject.title}
					</div>
					{/* Corps, au click on peut le modifier */}
					<div
						className="body"
						onClick={() => {
							// Uniquement la personne qui a crée le post peut modifier le post
							if (authState.username === postObject.username) {
								editPost('body')
							}
						}}
					>
						{postObject.postText}
					</div>
					{/* Username & like */}
					<div className="footer">
						<div className="username">{postObject.username}</div>
						<div className="buttons">
							{authState.username === postObject.username && (
								<DeleteIcon
									className="delete"
									onClick={() => {
										deletePost(postObject.id)
									}}
								></DeleteIcon>
							)}
						</div>
					</div>
				</div>
			</div>
			{/* Côté droit */}
			<div className="rightSide">
				{/* Ajout d'un commentaire */}
				<div className="addCommentContainer">
					<input
						type="text"
						placeholder="Comment..."
						autoComplete="off"
						// Valeur de l'input par défaut
						value={newComment}
						// Récupère le commentaire du form et le modifie dans le state
						onChange={(event) => {
							setNewComment(event.target.value)
						}}
					/>
					<button onClick={addComment}> Commenter</button>
				</div>
				{/* Liste des commentaires */}
				<div className="listOfComments">
					{/* Utilise map pour boucler et afficher tout les commentaires */}
					{comments.map((comment, key) => {
						return (
							<div key={key} className="comment">
								<div>
									{/* Affiche username et le commentaire depuis l'objet comment */}
									<label>{comment.username}</label> : {comment.commentBody}
								</div>
								<div>
									{/* Affiche l'icon delete si username de authState égal celui qui l'a écrit */}
									{authState.username === comment.username && (
										<DeleteIcon
											className="delete"
											onClick={() => {
												deleteComment(comment.id)
											}}
										></DeleteIcon>
									)}
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default Post
