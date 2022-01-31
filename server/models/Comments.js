// Crée la table Comments  avec deux colonnes (commentaire et son username)
module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define("Comments", {
    // Commentaire
    commentBody: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Comments;
};
