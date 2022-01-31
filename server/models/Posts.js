module.exports = (sequelize, DataTypes) => {
	// Crée la table Posts
	const Posts = sequelize.define('Posts', {
		// Crée des colonnes avec le type qui ne doit pas être nulle
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		postText: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	})

	// Associe les commentaires et les likes aux posts
	// Quand on supprime un post, ça supprime tout les commentaires et likes liés
	Posts.associate = (models) => {
		Posts.hasMany(models.Comments, {
			onDelete: 'cascade',
		})

		Posts.hasMany(models.Likes, {
			onDelete: 'cascade',
		})
	}
	return Posts
}
