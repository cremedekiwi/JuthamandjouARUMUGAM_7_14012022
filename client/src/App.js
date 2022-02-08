import './App.css'
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom'
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'
import Post from './pages/Post'
import Registration from './pages/Registration'
import Login from './pages/Login'
import PageNotFound from './pages/PageNotFound'
import Profile from './pages/Profile'
import ChangePassword from './pages/ChangePassword'
import { AuthContext } from './helpers/AuthContext'
import { useState, useEffect } from 'react'
import axios from 'axios'
import LogoutIcon from '@mui/icons-material/Logout'
import logo from './logo.png'

function App() {
	// Permet de savoir si on est connecté ou non, ce state contient username, id et le status
	const [authState, setAuthState] = useState({
		username: '',
		id: 0,
		status: false,
	})

	let history = useHistory()

	// Render quand on arrive sur la page
	useEffect(() => {
		// Récupère le token après s'être connecté
		axios
			.get('http://localhost:3001/auth/verify', {
				headers: {
					accessToken: localStorage.getItem('accessToken'),
				},
			})
			.then((response) => {
				// Si user pas authentifié ou avec un token non valide
				if (response.data.error) {
					setAuthState({ ...authState, status: false })
				}
				// Sinon user valide, il est authentifié avec username, id et status true
				else {
					setAuthState({
						username: response.data.username,
						id: response.data.id,
						status: true,
					})
				}
			})
	// eslint-disable-next-line
	}, [])

	// Fonction se déconnecter, supprime accessToken du localStorage, met à jour authState à false, et recharge la page
	const logout = () => {
		localStorage.removeItem('accessToken')
		setAuthState({ username: '', id: 0, status: false })
		window.location.reload()
	}

	return (
		<div className="App">
			{/* Permet de faire passer authState à toutes les routes */}
			<AuthContext.Provider value={{ authState, setAuthState }}>
				<Router>
					{/* Barre de navigation */}
					<div className="navbar">
						{/* Liens vers les autres pages */}
						<div className="links">
							{/* Si authState false (non login) afficher sur la navbar : logo, login et registration */}
							{!authState.status ? (
								<>
									<Link to="/login">
										<img src={logo} alt={'logo'} className="logo" />
									</Link>
									<Link to="/login"> Se connecter</Link>
									<Link to="/registration"> Créer nouveau compte</Link>
								</>
							) :
							// Sinon affiche le logo et createpost
							(
								<>
									<Link to="/">
										<img src={logo} alt={'logo'} className="logo" />
									</Link>
									<Link to="/createpost"> Créer une publication</Link>
								</>
							)}
						</div>
						<div className="loggedInContainer">
							{/* Affiche username */}
							<h1>{authState.username} </h1>
							{/* Si authState true (login), afficher l'icon logout */}
							{authState.status && (
								<LogoutIcon className="logout" onClick={logout}></LogoutIcon>
							)}
						</div>
					</div>
					{/* Router > Switch > Route ; affiche les pages par routes */}
					<Switch>
						<Route path="/" exact component={Home} />
						<Route path="/createpost" exact component={CreatePost} />
						{/* Affiche les posts individuellement au clic */}
						<Route path="/post/:id" exact component={Post} />
						<Route path="/registration" exact component={Registration} />
						<Route path="/login" exact component={Login} />
						{/* Affiche le profil avec les posts de l'user */}
						<Route path="/profile/:id" exact component={Profile} />
						<Route path="/changepassword" exact component={ChangePassword} />
						{/* Pour toutes les autres routes, error 404 */}
						<Route path="*" exact component={PageNotFound} />
					</Switch>
				</Router>
			</AuthContext.Provider>
		</div>
	)
}

export default App
