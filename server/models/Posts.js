module.exports = (sequelize, DataTypes) => {
	// Crée la table Posts
	const Posts = sequelize.define('Posts', {
		// Crée des colonnes avec le type, et il ne doit pas être nulle
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
