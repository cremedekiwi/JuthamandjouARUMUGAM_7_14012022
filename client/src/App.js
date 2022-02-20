import './App.css' // Importe le CSS
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom' // Importe les fonctions de routing
// Importe les pages
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'
import Post from './pages/Post'
import Registration from './pages/Registration'
import Login from './pages/Login'
import PageNotFound from './pages/PageNotFound'
import Profile from './pages/Profile'
import ChangePassword from './pages/ChangePassword'
import { AuthContext } from './helpers/AuthContext'
import { useState, useEffect } from 'react' // Importe useState et useEffect
import axios from 'axios' // Importe Axios
import LogoutIcon from '@mui/icons-material/Logout' // Importe l'icon logout
import logo from './logo.png' // Importe le logo

function App() {
	const [authState, setAuthState] = useState({ // Permet de savoir si on est connecté ou non, ce state contient username, id, status et isAdmin
		username: '',
		id: 0,
		status: false,
		isAdmin: false,
	})

	useEffect(() => {
		axios
			.get('http://localhost:3001/auth/verify', {
				headers: {
					accessToken: localStorage.getItem('accessToken'), // On a besoin du token dans le headers pour accéder à la requête
				},
			})
			.then((response) => {
				if (response.data.error) { // Si user n'est pas authentifié ou avec un token non valide
					setAuthState({ ...authState, status: false }) // on met le status de connexion à false
				}
				else { // Sinon user valide, il est authentifié avec les bons username, id, status et isAdmin
					setAuthState({
						username: response.data.username,
						id: response.data.id,
						status: true,
						isAdmin: response.data.isAdmin,
					})
				}
			})
	// eslint-disable-next-line
	}, [])

	// Fonction se déconnecter
	const logout = () => {
		localStorage.removeItem('accessToken') // Supprime accessToken du localStorage
		// Met à jour le status authState à false
		setAuthState({ username: '', id: 0, status: false, isAdmin: false }) 
		window.location.reload() // Recharge la page
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
									<Link to="/login"> Connexion</Link>
									<Link to="/registration"> Inscription</Link>
								</>
							) :
							// Sinon affiche le logo et createpost
							(
								<>
									<Link to="/">
										<img src={logo} alt={'logo'} className="logo" />
									</Link>
									{/* {console.log(window.location)} */}
									<Link to="/createpost">Publier</Link>
								</>
							)}
						</div>
						<div className="loggedInContainer">
							{/* Affiche username */}
							<Link to={`/profile/${authState.id}`} >
								<h1>{authState.username} </h1>
							</Link>
							
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
						{/* Affiche les posts individuellement */}
						<Route path="/post/:id" exact component={Post} />
						<Route path="/registration" exact component={Registration} />
						<Route path="/login" exact component={Login} />
						{/* Affiche le profil avec les posts de l'utilisateur */}
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
