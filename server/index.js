const express = require("express"); // Importe d'express
const app = express(); // Crée une const app pour pouvoir utiliser les fonctions d'express
const cors = require("cors"); // Importe de cors

app.use(express.json()); // on utilise la fonction express.json qui transforme les requêtes en json
app.use(cors()); // qui permet d’autoriser les requêtes entre notre client et notre server

const db = require("./models"); // Importe les modèles

// Importe des routes
const {router} = require("./routes/Posts");
app.use("/posts", router);
const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);

// db contient les modèles, et on utilise sequelize.sync() pour mettre à jour notre BDD
db.sequelize.sync().then(() => {
  // Ecoute sur le port 3001 et on affiche un message si c'est OK
  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});
