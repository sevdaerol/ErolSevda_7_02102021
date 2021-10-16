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

exports.start =  (req, res, next) => {
    //lancer la connection mysql
    connection.connect ((err) => { //se connecter
        if (err) {
        console.log ('Erreur de connexion à Mysql');
        }else {
            console.log ('Connexion à Mysql');
            
            //recuperer le contenue = donnees de la table user
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
            var userId = formuserid + ''; //formuserid = id du champs user du formulaire
            var sql = 'SELECT * FROM user WHERE id = ' + connection.escape(userId);
            connection.query(sql, function (error, results, fields) {
            if (error) throw error;
            // ...
            });
        }
    });
};

exports.end =  (req, res, next) => {
    connection.end();//terminer la connection
    console.log("Connexion terminer");
};
//terminer