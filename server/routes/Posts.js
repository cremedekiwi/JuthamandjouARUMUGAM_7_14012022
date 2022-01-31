const express = require('express')
const router = express.Router() // Permet de faire des routes
const { Posts, Likes } = require('../models')

const { validateToken } = require('../middlewares/AuthMiddleware')

// Affiche tout les posts
router.get('/', validateToken, async (req, res) => {
	const listOfPosts = await Posts.findAll({
		include: [Likes],
		order: [['id', 'DESC']], // Affiche les posts les plus récents en premier
	})
	const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } })
	res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts })
})

// Affiche les posts individuellement
router.get('/byId/:id', async (req, res) => {
	const id = req.params.id // récupère l'id
	const post = await Posts.findByPk(id) // récupère le post via la clé primaire (=id)
	res.json(post) // envoi la réponse
})

// Affiche les posts d'un user
router.get('/byuserId/:id', async (req, res) => {
	const id = req.params.id
	const listOfPosts = await Posts.findAll({
		where: { UserId: id },
		include: [Likes],
		order: [['id', 'DESC']],
	})
	res.json(listOfPosts)
})

// Crée le post
router.post('/', validateToken, async (req, res) => {
	const post = req.body // récupère les données du formulaire
	post.username = req.user.username
	post.UserId = req.user.id
	await Posts.create(post) // sequelize crée le post
	res.json(post) // envoi la réponse
})

// Modifie le titre
router.put('/title', validateToken, async (req, res) => {
	const { newTitle, id } = req.body
	await Posts.update({ title: newTitle }, { where: { id: id } })
	res.json(newTitle)
})

// Modifie le corps du texte
router.put('/postText', validateToken, async (req, res) => {
	const { newText, id } = req.body
	await Posts.update({ postText: newText }, { where: { id: id } })
	res.json(newText)
})

// Supprime le post
router.delete('/:postId', validateToken, async (req, res) => {
	const postId = req.params.postId
	await Posts.destroy({
		where: {
			id: postId,
		},
	})

	res.json('DELETED SUCCESSFULLY')
})

module.exports = router
