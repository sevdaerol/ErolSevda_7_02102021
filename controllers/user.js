const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DATABASE,
    insercureAuth: true
});

//fonction pour s'enregistrer
exports.signUp = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //crypter, hacher et saler le mdp 10 fois
    .then(hash => {
        connection.query("INSERT INTO user VALUES (NULL,'"+req.body.username+"','"+ req.body.email +"','"+ hash +"', 0);"    
        ,function(error, results, fields){
            if(error){
                console.log(error);
                res.status(400).json({error});
                next();
            };
            if(results){
                next();
            };
        });        
    })
    .catch(error => res.status(502).json({ error }));
};

//fonction pour recuperer id lutilisateur
exports.getUserId = (req, res, next) => {
    connection.query('SELECT id FROM user WHERE username="'+req.body.username+'";', function(error, results, fields){
        if (error) {
            res.status(402).json({error});
        };
        if(results){
            console.log("test pour trouver id")
            const token = jwt.sign(  //generer un nvx token
                {userId: results[0].user_id},
                'RANDOM_TOKEN_SECRET', //random token
                {expiresIn: "96h"}
            );
            resObject = {
                userId: results[0].id,
                token: token
            }
            console.log(resObject.token)
            res.status(201).json(resObject);
        }
    })
}

//fonction pour se connecter
exports.login = (req, res, next) => {
    connection.query("SELECT * FROM user WHERE email='"+req.body.email+"';",function(error, results, fields){
        if(error){
            res.status(400).json({error: "Utilisateur non trouvé!"});
        };
        if(results){ //si email trouver dans bdd ..
            if(results[0].password == undefined | results[0].email == undefined){ //si mdp nn definis
                console.log("Utilisateur non trouvé!");
                return res.status(401).json();
            }
            bcrypt.compare(req.body.password, results[0].password) //si mdp trouver alors comparer avec le hash dans bdd
            .then(valid => {
                if(!valid) { //si mauvaise mdp err
                    return res.status(401).json({error: 'Mot de passe incorrect!'});
                }
                if(results[0].isAdmin == 0){ // si mdp saisie correct et non admin
                    console.log(results[0].id)
                    const token = jwt.sign( //signer un nvx token
                        {userId: results[0].id},
                        'RANDOM_TOKEN_SECRET', //random token
                        {expiresIn: "96h"}
                    );
                    resObject = {
                        username: results[0].username,
                        userId: results[0].id,
                        token: token
                    };
                    res.status(202).json(resObject);
                    next();
                }
                if(results[0].isAdmin == 1){ //si msp saisie correct et admin
                    const isAdminId = results[0].id+"/isAdmin"
                    console.log(isAdminId)
                    const token = jwt.sign( //signer un nvx token
                        {userId: isAdminId},
                        'RANDOM_TOKEN_SECRET',
                        {expiresIn: "96h"}
                    );
                    resObject = {
                        username: results[0].username,
                        userId: results[0].id,
                        token: token
                    };
                    res.status(202).json(resObject);
                    next();
                }
                const token = jwt.sign(  //dans tout les cas generer un token
                    {userId: results[0].id},
                    'RANDOM_TOKEN_SECRET',
                    {expiresIn: "96h"}
                );
                resObject = { //objet reponse
                    username: results[0].username,
                    userId: results[0].id,
                    token: token
                };
                res.status(202).json(resObject);
                next();
            })
            .catch(error => res.status(500).json({error}));
            
        };
    });
} 

//fonction pour supprimer message + compte
exports.deleteUser = (req, res, next) => {
    connection.query('DELETE FROM message WHERE user_id='+req.params.id+';',function(error, results, fields){
        if(error){
        };
        if(results){
            return 1
        };
    });
    connection.query('DELETE FROM user WHERE id='+req.params.id+';',function(error, results, fields){
        if(error){
            res.status(400).json({error});
            next();
        };
        if(results){
            res.status(200).json({message: 'Compte supprimer!'});
            next();
        };
    });
};
//terminer