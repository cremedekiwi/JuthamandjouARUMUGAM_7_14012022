const express = require('express')
const router = express.Router()
const { Comments } = require('../models')
const { validateToken } = require('../middlewares/AuthMiddleware') // Importe le middleware pour vérifier si le token est valide

// Affiche les commentaires
router.get('/:postId', async (req, res) => {
	const postId = req.params.postId // Récupère l'id du post
	// Affiche tout les commentaires via l'id du post
	const comments = await Comments.findAll({
		where: { PostId: postId }
	})
	res.json(comments)
})

// Crée un commentaire
router.post('/', validateToken, async (req, res) => {
	const comment = req.body // Récupère le commentaire
	const username = req.user.username // Récupère username depuis la variable de auth
	comment.username = username // Rajoute à comment : username
	const newComment = await Comments.create(comment) // Crée le commentaire
	res.json(newComment) // Retourne le nouveau commentaire
})

// Supprime un commentaire avec son id
router.delete('/:commentId', validateToken, async (req, res) => {
	const commentId = req.params.commentId // Récupère l'id du commentaire

	await Comments.destroy({
		where: {
			id: commentId,
		},
	})

	res.json('Supprimé') // Envoi une réponse, pour pouvoir finir la requête
})

module.exports = router
