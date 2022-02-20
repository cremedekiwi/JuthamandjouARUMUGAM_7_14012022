module.exports = (sequelize, DataTypes) => { // Exporte le modèle
  const Users = sequelize.define("Users", { // Crée la table Users, avec les colonnes username, password, et isAdmin
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  // Un user peut avoir plusieurs likes, posts ou commentaire
  Users.associate = (models) => {
    Users.hasMany(models.Likes, {
      onDelete: "cascade",
    });

    Users.hasMany(models.Posts, {
      onDelete: "cascade",
    });

    Users.hasMany(models.Comments, {
			onDelete: 'cascade',
		})
  };

  return Users;
};
