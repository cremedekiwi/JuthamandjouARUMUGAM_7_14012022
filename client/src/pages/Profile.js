/* eslint eqeqeq: "off", curly: "error" */

import React, { useEffect, useState, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../helpers/AuthContext'

function Profile() {
	let { id } = useParams() // Récupère id de l'URL
	let history = useHistory()
	const [username, setUsername] = useState('') // State username
	const [listOfPosts, setListOfPosts] = useState([]) // State listOfPosts
	const { authState, setAuthState } = useContext(AuthContext)

	useEffect(() => {
		if (!localStorage.getItem('accessToken')) {
			history.push('/login')
		} else {
			// Récupère username et le rajoute au state
			axios.get(`http://localhost:3001/auth/basicInfo/${id}`).then((response) => {
				setUsername(response.data.username)
			})

			// Récupère les posts qui appartient au profil et le rajoute au state
			axios.get(`http://localhost:3001/posts/byUserId/${id}`).then((response) => {
				setListOfPosts(response.data)
			})
		}	
	}, [history, id])

	// Supprime un compte avec id
	const deleteAccount = () => {
		axios
			.delete(`http://localhost:3001/auth/deleteUser/${id}`, {
				headers: { accessToken: localStorage.getItem('accessToken') },
			})
			.then(() => {
				localStorage.removeItem('accessToken')
				setAuthState({ username: '', id: 0, status: false, isAdmin: false })
				alert('Compte supprimé')
				history.push('/login')
			})
	}

	return (
		<div className="profilePageContainer">
			<div className="basicInfo">
				{/* Username */}
				<h1>{username} </h1>
				{/* Affiche changer le MDP si c'est l'utilisateur du profil qui est connecté */}
				{authState.username === username && (
					<>
						<button
							onClick={() => {
								// Redirge vers la page changepassword
								history.push('/changepassword')
							}}
						>
							Changer le MDP
						</button>

						<button
						onClick={() => {
							deleteAccount(id)
						}}
						>
							Supprimer le compte
						</button>
					</>
					
				)}
			</div>
			<div className="listOfPosts">
				{/* Affiche tout les posts */}
				{listOfPosts.map((value, key) => {
					return (
						<div key={key} className="post">
							<div className="title"> {value.title} </div>
							<div
								className="body"
								onClick={() => {
									history.push(`/post/${value.id}`)
								}}
							>
								{value.postText}
								{value.imageUrl && <img src={`../${value.imageUrl}`} className="imagePost" alt="" />}
							</div>
							<div className="footer">
								<div className="username">{value.username}</div>
								<div className="buttons">
									<label> {value.Likes.length}</label>
								</div>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default Profile
