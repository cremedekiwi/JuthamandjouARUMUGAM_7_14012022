const express = require('express')
const router = express.Router() // Crée une const qui utilise la fonction Router
const { Users } = require('../models') // Import le modèle Users
const bcrypt = require('bcrypt') // Bcrypt permet de hash le password
const { validateToken } = require('../middlewares/AuthMiddleware') // Récupère le validateToken
const { sign } = require('jsonwebtoken') // Crée le token
require('dotenv').config() // dotenv contient les données sensible

// S'enregistrer
router.post('/', async (req, res) => {
	const { username, password } = req.body // On récupère dans le body username et password
	bcrypt.hash(password, 10).then((hash) => { // Crypte le mot de passe
		Users.create({ // Crée l'user
			username: username,
			password: hash,
		})
		res.json('Compte enregistré')
	})
})

// Se connecter
router.post('/login', async (req, res) => {
	const { username, password } = req.body // On récupère dans le body username et password
	const user = await Users.findOne({ where: { username: username } }) // Cherche user dans la BDD, en lui passant username

	if (!user) { // Vérifie si user existe
		res.json({ error: "L'utilisateur n'existe pas !" })
	} else {
		bcrypt.compare(password, user.password).then(async (match) => { // Vérifie si le mot de passe du body et de la BDD est similaire
			if (!match) { // Si pas de match
				res.json({ error: 'Mauvaise combination' }) // Envoi une erreur
			} else {
				// Crée le token avec sign de jsonwebtoken
				const accessToken = sign(
					{ username: user.username, id: user.id }, // Payload contient username et id
					`${process.env.SECRET}` // Secret pour protéger le token est dans le fichier dotenv
				)
				// Si c'est OK, envoi le token avec l'accessToken, l'username, id et isAdmin
				res.json({ token: accessToken, username: username, id: user.id, isAdmin: user.isAdmin })
			}
		})
	}
})

// Vérifie si l'utilisateur est auth ou non
router.get('/verify', validateToken, async (req, res) => {
	const { username } = req.user // On récupère username du validateToken
	// Cherche user dans la BDD, en lui passant username
	const user = await Users.findOne({ where: { username: username } }) 

	req.user.isAdmin = user.isAdmin // Ajoute isAdmin
	res.json(req.user) // Retourne si c'est valide ou non
})

// Récupère les infos pour le profil
router.get('/basicInfo/:id', async (req, res) => {
	const id = req.params.id // On récupère id dans l'url

	// Dans une const basicInfo on met les informations de l'utilisateur sans le mot de passe
	const basicInfo = await Users.findByPk(id, { 
		attributes: { exclude: ['password'] },
	})

	res.json(basicInfo)
})

// Modifie le mot de passe, user doit être login
router.put('/changepassword', validateToken, async (req, res) => {
	const { oldPassword, newPassword } = req.body // Récupère l'ancien et le nouveau password du body
	// Cherche user dans la BDD, en lui passant username
	const user = await Users.findOne({ where: { username: req.user.username } })

	// Utilise bcrypt pour comparer si le mot de passe est valide
	bcrypt.compare(oldPassword, user.password).then(async (match) => {
		if (!match)  { // Si pas de match
			res.json({ error: 'Mauvais mot de passe' })
		} else {
			// hash contient le nouveau mot de passe crypté
			bcrypt.hash(newPassword, 10).then((hash) => {
				Users.update( // On met à jour le password dans la table Users
					{ password: hash },
					{ where: { username: req.user.username } }
				)
				res.json('Mot de passe changé')
			})
		}
	})
})

// Supprime un utilisateur
router.delete('/deleteUser/:id', validateToken, async (req, res) => {
	const userId = req.params.id // On récupère l'id dans l'URL
	await Users.destroy({ // On le supprime
		where: {
			id: userId,
		},
	})

	res.json('Compte supprimé')
})

module.exports = router
