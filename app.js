const express = require('express');

const app = express();

const bodyParser = require('body-parser');

require('dotenv').config()
//se connecter a la bdd mysql
const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DATABASE
});
//lancer la connection mysql
connection.connect ((err) => { //se connecter
    if (err) {
      console.log ('Erreur de connexion à Mysql');
    }else {
    console.log ('Connexion à Mysql');  
    }
});
//recuperer donnees de la table user
connection.query ('SELECT * FROM user', (err, lignes) => {
    if (err) throw err;
  
    console.log ('Données reçues de user:');
    console.log (lignes);
});
//recuperer donnees de la table message
connection.query ('SELECT * FROM message', (err, lignes) => {
    if (err) throw err;
  
    console.log ('Données reçues de message:');
    console.log (lignes);
});

//eviter attaques par injections SQL
var userId = 'some user provided value';
var sql    = 'SELECT * FROM user WHERE id = ' + connection.escape(userId);
connection.query(sql, function (error, results, fields) {
  if (error) throw error;
  // ...
});
 
connection.end();//terminer la connection

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use((req, res) => {
    res.json({ message: 'requête reçue !' }); 
});

module.exports = app;