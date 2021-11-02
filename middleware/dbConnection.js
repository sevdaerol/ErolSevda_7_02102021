require('dotenv').config()
//se connecter a la bdd mysql
const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DATABASE,
  insercureAuth: true
});

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    };
});
console.log("Connexion a Mysql");

exports.start =  (req, res, next) => { //lancer la connexion

    next();
};

exports.end =  (req, res, next) => {
    connection.end();//terminer la connexion
    console.log("Connexion terminer");
};