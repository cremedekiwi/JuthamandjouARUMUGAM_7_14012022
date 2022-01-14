import './App.css'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
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

function App() {
	const [authState, setAuthState] = useState({
		username: '',
		id: 0,
		status: false,
	})

	useEffect(() => {
		axios
			.get('http://localhost:3001/auth/auth', {
				headers: {
					accessToken: localStorage.getItem('accessToken'),
				},
			})
			.then((response) => {
				if (response.data.error) {
					setAuthState({ ...authState, status: false })
				} else {
					setAuthState({
						username: response.data.username,
						id: response.data.id,
						status: true,
					})
				}
			})
	}, [])

	const logout = () => {
		localStorage.removeItem('accessToken')
		setAuthState({ username: '', id: 0, status: false })
		window.location.reload()
	}

	return (
		<div className="App">
			<AuthContext.Provider value={{ authState, setAuthState }}>
				<Router>
					<div className="navbar">
						<div className="links">
							{!authState.status ? (
								<>
									<Link to="/login"> Se connecter</Link>
									<Link to="/registration"> Créer nouveau compte</Link>
								</>
							) : (
								<>
									<Link to="/"> Groupomania</Link>
									<Link to="/createpost"> Créer une publication</Link>
								</>
							)}
						</div>
						<div className="loggedInContainer">
							<h1>{authState.username} </h1>
							{authState.status && (
								<LogoutIcon className="logout" onClick={logout}></LogoutIcon>
							)}
						</div>
					</div>
					<Switch>
						<Route path="/" exact component={Home} />
						<Route path="/createpost" exact component={CreatePost} />
						<Route path="/post/:id" exact component={Post} />
						<Route path="/registration" exact component={Registration} />
						<Route path="/login" exact component={Login} />
						<Route path="/profile/:id" exact component={Profile} />
						<Route path="/changepassword" exact component={ChangePassword} />
						<Route path="*" exact component={PageNotFound} />
					</Switch>
				</Router>
			</AuthContext.Provider>
		</div>
	)
}

export default App