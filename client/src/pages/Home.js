/* eslint eqeqeq: "off", curly: "error" */

import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt'

function Home() {
	const [listOfPosts, setListOfPosts] = useState([]) // Liste des posts
	const [likedPosts, setLikedPosts] = useState([]) // Liste des posts like
	let history = useHistory()

	useEffect(() => {
		// Si accessToken est false (non login), on redirige vers la page login
		if (!localStorage.getItem('accessToken')) {
			history.push('/login')
		}
		// Sinon on récupère les posts via axios
		else {
			axios
				.get('http://localhost:3001/posts', {
					headers: { accessToken: localStorage.getItem('accessToken') },
				})
				.then((response) => {
					// Modifie les states avec le contenu de la BDD
					setListOfPosts(response.data.listOfPosts)
					// Map à travers l'objet response.data.likedPosts pour retourner like.PostId
					setLikedPosts(
						response.data.likedPosts.map((like) => {
							return like.PostId
						})
					)
					// console.log(response)
				})
				.catch((err) => {
					console.log('err', err);
				})
		}
	}, [history])

	// Like un post, prend en paramètre postId
	const likeAPost = (postId) => {
		// Envoi le body avec postId, et le headers avec accessToken (pour valider avec le back)
		axios
			.post(
				'http://localhost:3001/likes',
				{ PostId: postId },
				{ headers: { accessToken: localStorage.getItem('accessToken') } }
			)
			// Récupère la réponse et la met dans notre state listOfPosts
			.then((response) => {
				setListOfPosts(
					// Map à travers tout nos posts
					listOfPosts.map((post) => {
						// Quand post.id est égal à postID (celui qu'on vient de cliquer)
						if (post.id === postId) {
							// Si response.data.liked est true
							if (response.data.liked) {
								// Return l'ancien post, on veut juste changer Likes
								// avec l'ancien array post.Likes et un nouveau item
								return { ...post, Likes: [...post.Likes, 0] }
							}
							// Sinon supprime le like du tableau
							else {
								// Crée une variable avec le tableau de likes
								const likesArray = post.Likes
								// Supprime le dernier élément avec pop
								likesArray.pop()
								// Return l'ancien post avec le nouveau tableau des likes
								return { ...post, Likes: likesArray }
							}
						} else {
							return post // Retourne le post sans modif
						}
					})
				)

				// Si likedPosts inclus postId
				if (likedPosts.includes(postId)) {
					// Filter likedPosts avec les id différent de postId
					setLikedPosts(
						likedPosts.filter((id) => {
							return id != postId
						})
					)
				}
				// Sinon récupérer l'ancien likedPosts; et rajouter le nouveau postId
				else {
					setLikedPosts([...likedPosts, postId])
				}
			})
	}

	return (
		<div>
			{/* Utilise map pour afficher chaque post du state */}
			{listOfPosts.map((value, key) => {
				return (
					// utiliser key={key} pour avoir un id unique, et ne pas avoir de warning
					<div key={key} className="post">
						
						{/* Titre */}
						<div className="title"> {value.title} </div>
						{/* Au click sur le post, redirige vers la page du post */}
						<div
							className="body"
							onClick={() => {
								history.push(`/post/${value.id}`)
							}}
						>
							{value.postText}
							{value.imageUrl != null && <img src={value.imageUrl} className="imagePost" alt="" />}
						</div>
						<div className="footer">
							{/* Username */}
							<div className="username">
								<Link to={`/profile/${value.UserId}`}> {value.username} </Link>
							</div>
							{/* Icon like, unlike */}
							<div className="buttons">
								{/* Material UI Icon */}
								<ThumbUpAltIcon
									onClick={() => {
										likeAPost(value.id)
									}}
									className={
										// Si dans likedPosts il y a value.id
										// défini la className selon si le bouton a été like ou non
										likedPosts.includes(value.id) ? 'likeBttn' : 'unlikeBttn'
									}
								/>
								{/* Nombre de like (utilise le length du array Likes) */}
								<label> {value.Likes.length}</label>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default Home
