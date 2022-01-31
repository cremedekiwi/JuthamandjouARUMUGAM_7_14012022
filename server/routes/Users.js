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
				res.json({ token: accessToken, username: username, id: user.id })
			} catch (error) {
				console.log(error)
			}
		})
	}
})

// Vérifie si l'utilisateur est auth ou non
router.get('/verify', validateToken, (req, res) => {
	res.json(req.user) // Retourne si c'est valide ou non
})

router.get('/basicinfo/:id', async (req, res) => {
	const id = req.params.id

	const basicInfo = await Users.findByPk(id, {
		attributes: { exclude: ['password'] },
	})

	res.json(basicInfo)
})

router.put('/changepassword', validateToken, async (req, res) => {
	const { oldPassword, newPassword } = req.body
	const user = await Users.findOne({ where: { username: req.user.username } })

	bcrypt.compare(oldPassword, user.password).then(async (match) => {
		if (!match) res.json({ error: 'Mauvais mot de passe' })

		bcrypt.hash(newPassword, 10).then((hash) => {
			Users.update(
				{ password: hash },
				{ where: { username: req.user.username } }
			)
			res.json('Mot de passe changé')
		})
	})
})

module.exports = router
