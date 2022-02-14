const { Users } = require('../models')

const { verify } = require("jsonwebtoken"); // Permet de vérifier un token
require('dotenv').config() // Utilise dotenv pour cacher des données sensibles

// Fonction qui se lance avant une requête, vérfie si on continue ou non
const validateToken = async (req, res, next) => {
  const accessToken = req.header("accessToken"); // Récupère accessToken depuis header

  // Vérifie si accessToken existe, si quelqu'un est login
  if (!accessToken) return res.json({ error: "L'utilisateur n'est pas connecté !" });

  // Utilise verify de jsonwebtoken pour voir si le token est valide
  try {
    const validToken = verify(accessToken, `${process.env.SECRET}`); // ON utilise une var pour le SECRET
    req.user = validToken; // Crée une variable user avec les informations de validToken (username + id)

    // const id = req.user.id
    // const users = await Users.findByPk(id, { attributes: { exclude: ['password'] } })
    // console.log(users.isAdmin)

    // Si validToken est true, autorise la poursuite de la requête
    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.json({ error: err });
  }
};

module.exports = { validateToken };
