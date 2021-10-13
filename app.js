const express = require('express');

const app = express();

const bodyParser = require('body-parser');

require('dotenv').config()

const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DATABASE
});

connection.connect ((err) => { //se connecter
    if (err) {
      console.log ('Erreur de connexion à Mysql');
    }else {
    console.log ('Connexion à Mysql');  
    }
});

connection.query ('SELECT * FROM user', (err, lignes) => {
    if (err) throw err;
  
    console.log ('Données reçues de user:');
    console.log (lignes);
});

connection.query ('SELECT * FROM message', (err, lignes) => {
    if (err) throw err;
  
    console.log ('Données reçues de message:');
    console.log (lignes);
});
 
connection.end();

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