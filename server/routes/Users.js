const express = require('express')
const router = express.Router() // Crée une const qui utilise la fonction Router
const { Users } = require('../models') // Importe le modèle Users
const bcrypt = require('bcrypt') // Importe bcrypt qui permet de hash ou de comparer le password
const { validateToken } = require('../middlewares/AuthMiddleware') // Récupère le validateToken
const { sign } = require('jsonwebtoken') // Permet de se connecter avec le token
require('dotenv').config()

// S'enregistrer
router.post('/', async (req, res) => {
	const { username, password } = req.body // On récupère dans le body username et password
	const user = await Users.findOne({ where: { username: username } }) // Cherche l’utilisateur dans la BDD, en lui passant username

	if (user) { // Vérifie si l’utilisateur existe
		res.json({ error: "L'utilisateur existe !" })
	} else {
		bcrypt.hash(password, 10).then((hash) => { // Crypte le mot de passe avec un salage de 10
			Users.create({ // Crée l'utilisateur
				username: username,
				password: hash,
			})
			res.json('Compte enregistré')
		})
	}
})

// Se connecter
router.post('/login', async (req, res) => {
	const { username, password } = req.body
	const user = await Users.findOne({ where: { username: username } })

	if (!user) {
		res.json({ error: "L'utilisateur n'existe pas !" })
	} else {
		bcrypt.compare(password, user.password).then(async (match) => { // Vérifie si le mot de passe du body et de la BDD est similaire
			if (!match) { // Si ce n’est pas le cas
				res.json({ error: 'Mauvaise combination' }) // Envoi une erreur
			} else {
				// Crée le token avec sign de jsonwebtoken
				const accessToken = sign(
					{ username: user.username, id: user.id }, // Premier paramètre : payload qui contient username et id
					`${process.env.SECRET}` // Deuxième paramètre : c’est le secret qui est dans le fichier .env
				)
				// Si c'est OK, envoi le token, username, id et isAdmin
				res.json({ token: accessToken, username: username, id: user.id, isAdmin: user.isAdmin })
			}
		})
	}
})

// Vérifie si l'utilisateur est auth ou non
router.get('/verify', validateToken, async (req, res) => {
	const { username } = req.user // On récupère username du validateToken
	const user = await Users.findOne({ where: { username: username } }) 

	req.user.isAdmin = user.isAdmin // Ajoute isAdmin
	res.json(req.user) // Retourne si l’utilisateur est valide ou non
})

// Récupère les infos pour le profil
router.get('/basicInfo/:id', async (req, res) => {
	const id = req.params.id // On récupère l'id dans l'url

	// Dans une const basicInfo on met les informations de l'utilisateur sans le mot de passe
	const basicInfo = await Users.findByPk(id, { 
		attributes: { exclude: ['password'] },
	})

	res.json(basicInfo)
})

// Modifie le mot de passe, user doit être login
router.put('/changepassword', validateToken, async (req, res) => {
	const { oldPassword, newPassword } = req.body // Récupère l'ancien et le nouveau password du body
	const user = await Users.findOne({ where: { username: req.user.username } })

	// Même principe que pour la connexion
	bcrypt.compare(oldPassword, user.password).then(async (match) => {
		if (!match)  {
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
	const userId = req.params.id
	await Users.destroy({ // On le supprime avec la fonction destroy de sequelize en indiquant userId
		where: {
			id: userId,
		},
	})

	res.json('Compte supprimé')
})

module.exports = router
