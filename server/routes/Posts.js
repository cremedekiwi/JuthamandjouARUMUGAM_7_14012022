const express = require('express')
const router = express.Router() // Permet de faire des routes
const { Posts, Likes } = require('../models')

const { validateToken } = require('../middlewares/AuthMiddleware')

// Affiche tout les posts
router.get('/', validateToken, async (req, res) => {
	// Tableau listOfPosts
	const listOfPosts = await Posts.findAll({
		include: [Likes], // Inclus le modèle des Likes
		order: [['id', 'DESC']], // Affiche les posts les plus récents en premier
	})

	// Tableau likedPosts, trouve tout les Likes où UserId est celui qui est connecté
	const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } })

	// Envoi listOfPosts et likedPosts
	res.json({ listOfPosts, likedPosts })
})

// Affiche les posts individuellement
router.get('/byId/:id', async (req, res) => {
	const id = req.params.id // récupère l'id
	const post = await Posts.findByPk(id) // récupère le post via la clé primaire (=id)
	res.json(post) // envoi la réponse
})

// Affiche les posts d'un user
router.get('/byUserId/:id', async (req, res) => {
	const id = req.params.id
	// Cherche les posts quand UserId: id, join les Likes 
	const listOfPosts = await Posts.findAll({
		where: { UserId: id },
		include: [Likes],
		order: [['id', 'DESC']],
	})
	res.json(listOfPosts)
})

// Crée le post
router.post('/', validateToken, async (req, res) => {
	const post = req.body // Récupère les données du formulaire : title et postText
	post.username = req.user.username // Récupère username depuis validateToken
	post.UserId = req.user.id // Récupère id depuis validateToken
	await Posts.create(post) // Sequelize crée le post, il a besoin de toutes ces colonnes
	res.json(post) // Envoi la réponse
})

// Modifie le titre
router.put('/title', validateToken, async (req, res) => {
	const { newTitle, id } = req.body // Récupère newTitle et id du body
	await Posts.update({ title: newTitle }, { where: { id: id } }) // Met à jour newTitle grâce à id
	res.json(newTitle)
})

// Modifie le corps du texte
router.put('/postText', validateToken, async (req, res) => {
	const { newText, id } = req.body // Récupère newText et id du body
	await Posts.update({ postText: newText }, { where: { id: id } }) // Met à jour postText grâce à id
	res.json(newText)
})

// Supprime le post avec postId
router.delete('/:postId', validateToken, async (req, res) => {
	const postId = req.params.postId
	await Posts.destroy({
		where: {
			id: postId,
		},
	})

	res.json('Supprimé')
})

module.exports = router
