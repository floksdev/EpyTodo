const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config().parsed;

const connection = mysql.createConnection({
    host: dotenv.MYSQL_HOST,
    user: dotenv.MYSQL_USER,
    password: dotenv.MYSQL_PASSWORD,
    database: dotenv.MYSQL_DATABASE
  });

  connection.connect((err) => {
    if (err) throw err;
    console.log('Connecté à la base de données MySQL !');
  });

  module.exports = connection;