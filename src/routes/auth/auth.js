const express = require("express");
const app = express();
const connection = require("../../config/db");
const todos = require("../todos/todos");
const userinfos = require("../user/user");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const {get_data_for_login} = require("../user/user.query");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/register", function (req, res, next) {
  res.send(`
    <form action="/register" method="POST">
      Nom:<br>
      <input type="text" name="name" placeholder="Mon Prénom">
      <br>Prénom:<br>
      <input type="text" name="firstname" placeholder="Mon Nom">
      <br>Email:<br>
      <input type="email" name="email" placeholder="mon-email@example.com">
      <br>Mot de passe:<br>
      <input type="password" name="password" placeholder="Mot de passe"> <br><br>
      <input type="submit" value="✅ | Valider">
    </form>
    <form action="/login" method="GET">
    <input type="submit" value="👥 | Login">
    </form>
    <style>body { background-color: #ADD8E6; }</style>
  `);
});

app.post("/register", function (req, res, next) {
  var { email, name, firstname, password } = req.body;
  var errors = {};

  if (!email) {
    errors.email = "❌ Adresse mail incorrecte";
  }

  if (!name) {
    errors.name = " ❌ Nom incorrect";
  }

  if (!firstname) {
    errors.firstname = "❌ Prénom incorrect";
  }

  if (!password) {
    errors.password = "❌ Mot de passe incorrect";
  }

  var sql = `SELECT * FROM user WHERE email = "${email}"`;
  connection.query(sql, function (err, results) {

    if (results.length > 0) {
      errors.email = "❌ L'utilisateur existe déjà";
    }

    if (Object.keys(errors).length > 0) {
      return res.send(`
        <form action="/register" method="POST">
          Nom:<br>
          <input type="text" name="name">
          <span class="error">${errors.name || ""}</span>
          <br>Prénom:<br>
          <input type="text" name="firstname">
          <span class="error">${errors.firstname || ""}</span>
          <br>Email:<br>
          <input type="email" name="email">
          <span class="error">${errors.email || ""}</span>
          <br>Mot de passe:<br>
          <input type="password" name="password">
          <span class="error">${errors.password || ""}</span>
          <br><br>
          <input type="submit" value="✅ | Valider">
        </form>
        <style>body { background-color: #ADD8E6; }</style>
      `);
    }

    // Hachage du mot de passe
    password = bcrypt.hashSync(password, 10);

    // Insertion de l'utilisateur dans la base de données
    var sql = `INSERT INTO user (email, name, firstname, password, created_at) VALUES ("${email}", "${name}", "${firstname}", "${password}", NOW())`;
    connection.query(sql, function (err, results) {
      if (err) {
        console.log("Erreur lors de l'insertion de l'utilisateur :", err);
        return res.status(500).send("Erreur de serveur");
      }

      console.log('Nouvel utilisateur créeé !');
      res.redirect('/login');
    });
  });
});


app.get("/login", (req, res) => {
  res.send(`
    <form action="/login" method="POST">
      <br>Email:<br>
      <input type="email" name="email" placeholder="mon-email@example.com">
      <br>Mot de passe:<br>
      <input type="password" name="password" placeholder="Mot de passe"> <br><br>
      <input type="submit" value="✅ | Valider">
    </form>
    <form action="/register" method="GET">
    <input type="submit" value="👤 | Register">
    </form>
    <style>body { background-color: #ADD8E6; }</style>
  `);
});

app.post("/login", (req, res) => {
  var {email, password} = req.body;
  var errors = {};
  get_data_for_login(req, res, bcrypt, email, password, function(nbr) {
    if (nbr == 84) {
      errors.nbr = "❌ Mail ou mot de passe incorrect";
      res.send(`
      <form action="/login" method="POST">
      <br>Email:<br>
      <input type="email" name="email" placeholder="mon-email@example.com">
      <span class="error">${errors.nbr || ""}</span>
      <br>Mot de passe:<br>
      <input type="password" name="password" placeholder="Mot de passe"> <br><br>
      <input type="submit" value="✅ | Valider">
    </form>
    <form action="/register" method="GET">
    <input type="submit" value="👤 | Register">
    </form>
    <style>body { background-color: #ADD8E6; }</style>
    `);
    } else {
      res.redirect("/todos");
    }
  });
});

app.use("/", todos);
app.use("/", userinfos);

module.exports = app;
