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
	const { authState } = useContext(AuthContext)

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

	// Supprime un commentaire
	const deleteComment = (id) => {
		axios
			.delete(`http://localhost:3001/comments/${id}`, {
				headers: { accessToken: localStorage.getItem('accessToken') },
			})
			.then(() => {
				setComments(
					comments.filter((val) => {
						return val.id != id
					})
				)
			})
	}

	// Supprime un post
	const deletePost = (id) => {
		axios
			.delete(`http://localhost:3001/posts/${id}`, {
				headers: { accessToken: localStorage.getItem('accessToken') },
			})
			.then(() => {
				history.push('/')
			})
	}

	// Modifie un post
	const editPost = (option) => {
		if (option === 'title') {
			let newTitle = prompt('Enter New Title:')
			if (newTitle != undefined && newTitle != "") {
				axios.put(
					'http://localhost:3001/posts/title',
					{
						newTitle: newTitle,
						id: id,
					},
					{
						headers: { accessToken: localStorage.getItem('accessToken') },
					}
				)
				
					setPostObject({ ...postObject, title: newTitle })
			}
		} else {
			let newPostText = prompt('Enter New Text:')
			if (newPostText != undefined && newPostText != "") {
				axios.put(
					'http://localhost:3001/posts/postText',
					{
						newText: newPostText,
						id: id,
					},
					{
						headers: { accessToken: localStorage.getItem('accessToken') },
					}
				)

					setPostObject({ ...postObject, postText: newPostText })
			}
		}
	}

	return (
		<div className="postPage">
			{/* Côté gauche : post */}
			<div className="leftSide">
				<div className="post" id="individual">
					<div
						className="title"
						onClick={() => {
							if (authState.username === postObject.username) {
								editPost('title')
							}
						}}
					>
						{postObject.title}
					</div>
					<div
						className="body"
						onClick={() => {
							if (authState.username === postObject.username) {
								editPost('body')
							}
						}}
					>
						{postObject.postText}
					</div>
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
