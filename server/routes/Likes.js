const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

// Like un post
router.post("/", validateToken, async (req, res) => {
  const { PostId } = req.body;
  const UserId = req.user.id;

  // Vérifie si la ligne existe dans la table
  const found = await Likes.findOne({
    where: { PostId: PostId, UserId: UserId },
  });

  // Si elle n'existe pas
  if (!found) {
    // On peut like = crée dans la table like, une ligne PostId et UserId
    await Likes.create({ PostId: PostId, UserId: UserId });
    // liked: true
    res.json({ liked: true });
  } else {
    // Sinon on Unlike : on supprime de la table like PostId et UserId
    await Likes.destroy({
      where: { PostId: PostId, UserId: UserId },
    });
    // liked : false
    res.json({ liked: false });
  }
});

module.exports = router;
