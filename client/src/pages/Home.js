/* eslint eqeqeq: "off", curly: "error" */

import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt'

function Home() {
	const [listOfPosts, setListOfPosts] = useState([])
	const [likedPosts, setLikedPosts] = useState([])
	let history = useHistory()

	useEffect(() => {
		if (!localStorage.getItem('accessToken')) {
			history.push('/login')
		} else {
			axios
				.get('http://localhost:3001/posts', {
					headers: { accessToken: localStorage.getItem('accessToken') },
				})
				.then((response) => {
					setListOfPosts(response.data.listOfPosts)
					setLikedPosts(
						response.data.likedPosts.map((like) => {
							return like.PostId
						})
					)
				})
		}
		// eslint-disable-next-line
	}, [])

	const likeAPost = (postId) => {
		// Utilise axios pour faire une requête vers notre bdd
		axios
			.post(
				'http://localhost:3001/likes',
				{ PostId: postId },
				{ headers: { accessToken: localStorage.getItem('accessToken') } }
			)
			// récupère la réponse et la met dans notre state listOfPosts
			.then((response) => {
				setListOfPosts(
					listOfPosts.map((post) => {
						if (post.id === postId) {
							if (response.data.liked) {
								return { ...post, Likes: [...post.Likes, 0] }
							} else {
								const likesArray = post.Likes
								likesArray.pop()
								return { ...post, Likes: likesArray }
							}
						} else {
							return post
						}
					})
				)

				if (likedPosts.includes(postId)) {
					setLikedPosts(
						likedPosts.filter((id) => {
							return id != postId
						})
					)
				} else {
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
						<div className="title"> {value.title} </div>
						<div
							className="body"
							onClick={() => {
								history.push(`/post/${value.id}`)
							}}
						>
							{value.postText}
						</div>
						<div className="footer">
							<div className="username">
								<Link to={`/profile/${value.UserId}`}> {value.username} </Link>
							</div>
							<div className="buttons">
								<ThumbUpAltIcon
									onClick={() => {
										likeAPost(value.id)
									}}
									className={
										likedPosts.includes(value.id) ? 'likeBttn' : 'unlikeBttn'
									}
								/>

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
