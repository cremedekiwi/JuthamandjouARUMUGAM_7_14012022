const express = require('express')
const router = express.Router()
const { Comments } = require('../models')
const { validateToken } = require('../middlewares/AuthMiddleware')

// Affiche
router.get('/:postId', async (req, res) => {
	const postId = req.params.postId
	// Affiche tous les commentaires grâce à postId
	const comments = await Comments.findAll({
		where: { PostId: postId }
	})
	res.json(comments)
})

// Créé
router.post('/', validateToken, async (req, res) => {
	const comment = req.body
	const username = req.user.username
	comment.username = username // Rajoute à comment : username
	const newComment = await Comments.create(comment) // Crée le commentaire
	res.json(newComment)
})

// Supprime
router.delete('/:commentId', validateToken, async (req, res) => {
	const commentId = req.params.commentId

	await Comments.destroy({ // Supprime un commentaire avec commentId
		where: {
			id: commentId,
		},
	})

	res.json('Supprimé')
})

module.exports = router
