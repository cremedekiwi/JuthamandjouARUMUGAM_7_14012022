const express = require("express"); // Import d'express
const app = express(); // Crée une const app pour pouvoir utiliser les fonctions d'express
const cors = require("cors"); // Import de cors

app.use(express.json()); // express.json transforme les requêtes en json
app.use(cors()); // cors permet de faire des requêtes entre client et server

const db = require("./models"); // Import des modéles

// Import des routes
const {router} = require("./routes/Posts");
app.use("/posts", router);
const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);

// Met à jour la BDD à chaque action
db.sequelize.sync().then(() => {
  // Ecoute sur le port 3001 et on affiche un message si c'est OK
  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});
