const express = require("express");
const app = express(); // Pour faire des requêtes API, initialiser le server
const cors = require("cors");

app.use(express.json()); // parse le body
app.use(cors()); // permet de faire des requêtes entre client et server

const db = require("./models"); // importe les modéles

// Routes, import de sa route son utilisation
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);
const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);

// Permet de mettre à jour sa base de donnée
db.sequelize.sync().then(() => {
  // Ecoute sur le port 3001, affiche un message si c'est OK
  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});
