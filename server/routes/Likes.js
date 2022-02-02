const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

// Like un post
router.post("/", validateToken, async (req, res) => {
  const { PostId } = req.body; // Récupère PostId
  const UserId = req.user.id; // Récupère UserId depuis le middleware validateToken

  // Vérifie si la ligne existe dans la table
  const found = await Likes.findOne({
    where: { PostId: PostId, UserId: UserId },
  });

  // Si elle n'existe pas
  if (!found) {
    // Like : crée dans la table like, une ligne PostId et UserId
    await Likes.create({ PostId: PostId, UserId: UserId });
    // Si liked: true
    res.json({ liked: true });
  } else {
    // Unlike : sinon supprime de la table like PostId et UserId
    await Likes.destroy({
      where: { PostId: PostId, UserId: UserId },
    });
    // Sinon liked : false
    res.json({ liked: false });
  }
});

module.exports = router;
