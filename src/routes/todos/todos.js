const express = require("express");
const app = express();
const connection = require("../../config/db");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/todos", function (req, res, next) {
  // Récupérer tous les todos de l'utilisateur
  var sql = `SELECT * FROM todo WHERE user_id = "${global.id_db}"`;
  connection.query(sql, function (err, results) {
    if (err) {
      console.log("Erreur lors de la récupération des todos :", err);
      return res.status(500).send("Erreur de serveur");
    }
    if (results.length > 0) {
      // Afficher tous les todos
      let todos = "";
      results.forEach(todo => {
        todos += `
          <h4>Todo:</h4>
          Titre: ${todo.title}<br>
          Description: ${todo.description}<br>
          Temps restant: ${todo.due_time}h <br>
          <br>
        `;
      });

      res.send(`
        <h1>📋 EpyTodo 📋</h1>
        <h4><i>📋 Bienvenue sur le Todo Manager 📋</i></h4>
        <h5><i> Voici la liste de tes tâches </i></h5><br>
        Votre id: ${global.id_db}
        ${todos}
        <form action="/todos" method="POST">
        <h3>Créer une nouvelle tache:</h3>
          Titre:<br>
          <input type="text" name="title" placeholder="Titre du todo">
          <br>Description:<br>
          <input type="description" name="description" placeholder="Description">
          <br>Durée (en h):<br>
          <input type="number" name="due_time" placeholder="Limite de temps">
          <input type="submit" value="✅ | Valider">
        </form>
        <form action="/user" method="GET">
          <input type="submit" value="🔓 | View my informations">
        </form>
        <style>body { background-color: #ADD8E6; }</style>
      `);
    } else {
      res.send(`
        <h1>📋 EpyTodo 📋</h1>
        <h4><i>📋 Bienvenue sur le Todo Manager 📋</i></h4>
        <h5><i> Tu n'as pas encore de taches </i></h5>
        <form action="/todos" method="POST">
        <h3>Créer une nouvelle tache:</h3>
        Titre:<br>
          <input type="text" name="title" placeholder="Titre du todo">
          <br>Description:<br>
          <input type="description" name="description" placeholder="Description">
          <br>Durée (en h):<br>
          <input type="number" name="due_time" placeholder="Limite de temps">
          <input type="submit" value="✅ | Valider">
        </form>
        <form action="/user" method="GET">
          <input type="submit" value="🔓 | View my informations">
        </form>
        <form action="/login" method="GET">
        <input type="submit" value="👥 | Login">
        </form>
        <style>body { background-color: #ADD8E6; }</style>
      `);
    }
  });
});

app.post("/todos", function (req, res, next) {
  var { title, description, due_time } = req.body;
  var user_id = global.id_db;
  if (!title || !description || !due_time || !user_id) {
    return res.send("Les champs Titre et Description sont obligatoires !");
  }

  // Insérer les données dans la base de données
  var sql = `INSERT INTO todo (title, description, due_time, created_at, user_id) VALUES ("${title}", "${description}", "${due_time}", NOW(), "${user_id}")`;
  connection.query(sql, function (err, results) {
    if (err) {
      console.log("Erreur lors de l'insertion du todo :", err);
      return res.status(500).send("Erreur de serveur");
    }

    // Afficher tous les todos de l'utilisateur après l'insertion
    var sql = `SELECT * FROM todo WHERE user_id = "${user_id}"`;
    connection.query(sql, function (err, results) {
      if (err) {
        console.log("Erreur lors de la récupération des todos :", err);
        return res.status(500).send("Erreur de serveur");
      }

      // Afficher tous les todos
      let todos = "";
      results.forEach(todo => {
        todos += `
          <h4>Todo:</h4>
          Titre: ${todo.title}<br>
          Description: ${todo.description}<br>
          Temps restant: ${todo.due_time}h <br>
          <br><br>
        `;
      });

      res.send(`
        <h1>📋 EpyTodo 📋</h1>
        <h4><i>📋 Bienvenue sur le Todo Manager 📋</i></h4>
        <h5><i> Voici la liste de tes tâches </i></h5><br>
        Votre id: ${user_id}<br>
        ${todos}
        <form action="/todos" method="POST">
        <h3>Créer une nouvelle tache:</h3>
          Titre:<br>
          <input type="text" name="title" placeholder="Titre du todo">
          <br>Description:<br>
          <input type="description" name="description" placeholder="Description">
          <br>Durée (en h):<br>
          <input type="number" name="due_time" placeholder="Limite de temps">
          <input type="submit" value="✅ | Valider">
        </form>
        <form action="/user" method="GET">
          <input type="submit" value="🔓 | View my informations">
        </form>
        <style>body { background-color: #ADD8E6; }</style>
      `);
      console.log('Nouvelle tache créee !');
    });
  });
});

module.exports = app;

