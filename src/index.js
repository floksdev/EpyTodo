const express = require("express") ;
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config().parsed;
const auth = require("./routes/auth/auth");
const connection = require('./config/db');
const app = express();
const port = 3000;

app.use("/", auth);


app.get('/', (req, res) => {
  const name = req.params.name;
  const title = "📋 EpyTodo 📋";

  res.send(`<h1>${title}<h1>
  <form action="/login" method="GET">
    <input type="submit" value="Login">
    </form>
  <form action="/register" method="GET">
    <input type="submit" value="Register">
    </form>
    <style>body { background-color: #ADD8E6; }</style>
    `);
});

app.listen (port , () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
