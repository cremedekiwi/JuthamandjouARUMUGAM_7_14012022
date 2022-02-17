const { verify } = require("jsonwebtoken"); // Permet de vérifier un token
require('dotenv').config() // dotenv contient les données sensible

// Fonction qui se lance avant une requête, vérfie si on continue ou non
const validateToken = async (req, res, next) => {
  const accessToken = req.header("accessToken"); // Récupère accessToken depuis header

  // Vérifie si l'utilisateur est connecté
  if (!accessToken) return res.json({ error: "L'utilisateur n'est pas connecté !" });

  // Utilise verify de jsonwebtoken pour voir si le token est valide
  try {
    const validToken = verify(accessToken, `${process.env.SECRET}`); // Vérifie le token
    req.user = validToken; // Affecte les informations de validToken à req.user (username + id)

    // Si validToken est true, autorise la poursuite de la requête
    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.json({ error: err });
  }
};

module.exports = { validateToken };
