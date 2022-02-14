const express = require('express')
const router = express.Router()
const { Users } = require('../models')
const bcrypt = require('bcrypt') // Permet de hash le password
const { validateToken } = require('../middlewares/AuthMiddleware')
const { sign } = require('jsonwebtoken') // Crée le token
require('dotenv').config()

// S'enregistrer
router.post('/', async (req, res) => {
	const { username, password } = req.body
	// Crypte le mot de passe
	bcrypt.hash(password, 10).then((hash) => {
		// Crée l'user
		Users.create({
			username: username,
			password: hash,
		})
		res.json('Compte enregistré')
	})
})

// Se connecter
router.post('/login', async (req, res) => {
	const { username, password } = req.body

	// Cherche user dans la BDD, en lui passant le body
	const user = await Users.findOne({ where: { username: username } })

	// Vérifie si user existe
	if (!user) {
		res.json({ error: "L'utilisateur n'existe pas !" })
	} else {
		// Vérifie si le mot de passe du body et de la BDD est similaire
		bcrypt.compare(password, user.password).then(async (match) => {
			try {
				if (!match)
					res.json({ error: 'Mauvaise combination' })

				// Crée le token avec sign de jsonwebtoken
				const accessToken = sign(
					{ username: user.username, id: user.id }, // Payload
					`${process.env.SECRET}` // Secret pour protéger son token
				)
				// Si c'est OK, envoi le token avec l'accessToken, l'username et l'id
				res.json({ token: accessToken, username: username, id: user.id, isAdmin: user.isAdmin })
			} catch (error) {
				console.log(error)
			}
		})
	}
})

// Vérifie si l'utilisateur est auth ou non
router.get('/verify', validateToken, async (req, res) => {
	const { username } = req.user

	const user = await Users.findOne({ where: { username: username } })

	req.user.isAdmin = user.isAdmin // Ajoute isAdmin 

	res.json(req.user) // Retourne si c'est valide ou non
})

// Récupère les infos pour le profil
router.get('/basicInfo/:id', async (req, res) => {
	const id = req.params.id

	// Cherche avec la clé primaire dans la table Users sans le MDP
	const basicInfo = await Users.findByPk(id, {
		attributes: { exclude: ['password'] },
	})

	res.json(basicInfo)
})

// Modifie le mot de passe, user doit être login
router.put('/changepassword', validateToken, async (req, res) => {
	const { oldPassword, newPassword } = req.body // Récupère l'ancien et le nouveau password du body
	const user = await Users.findOne({ where: { username: req.user.username } }) // Récupère user

	// Utilise bcrypt pour comparer lsi le mot de passe est valide
	bcrypt.compare(oldPassword, user.password).then(async (match) => {
		if (!match)  {
			res.json({ error: 'Mauvais mot de passe' })
		} else {
			// hash contient le nouveau mot de passe crypt
			bcrypt.hash(newPassword, 10).then((hash) => {
			Users.update(
				{ password: hash },
				{ where: { username: req.user.username } }
			)
			res.json('Mot de passe changé')
			})
		}
	})
})

// Supprime un user
router.delete('/deleteUser/:id', validateToken, async (req, res) => {
	const userId = req.user.id
	await Users.destroy({
		where: {
			id: userId,
		},
	})

	res.json('Compte supprimé')
})

module.exports = router
