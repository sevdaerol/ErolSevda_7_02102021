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

//s'enregistrer
exports.signUp = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //crypter, hacher et saler le mdp 10 fois
    .then(hash => {
        //console.log(req.body.password);
        signIn = "INSERT INTO user VALUES (NULL,'"+req.body.email+"','"+ req.body.username +"','"+ hash +"', 0);";
        //console.log("create user: " + signIn);
        connection.query( signIn
         ,function(error, results, fields){
            if(error){
                console.log(error);
                res.status(400).json({error});
                next();
            };
            if(results){
                //console.log("utilisateur créer!");
                next();
            };
        });
    })
    .catch(error => {
        console.log("Utilisateur non crée!" , error);
        res.status(500).json({error });
    });
};

//recuperer l'id utilisateur
exports.getUserId = (req, res, next) => {
    connection.query('SELECT id FROM user WHERE username="'+req.body.username+'";', function(error, results, fields){
        if (error) {
            res.status(400).json({error});
        };
        if(results){
            //console.log("test pour trouver user id")
            const token = jwt.sign(  //generer un nouveaux token
                {userId: results[0].user_id}, //user_id = id de user dans message
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

//se connecter
exports.login = (req, res, next) => {
    connection.query("SELECT * FROM user WHERE email='"+req.body.email+"';",function(error, results, fields){
        if(error){
            res.status(400).json({error: "Utilisateur non trouvé!"});
        };
        if(results){ //si email trouver dans la bdd ..
            if(results[0].password == undefined | results[0].email == undefined){ //si password ou email non definis..
                console.log("Utilisateur non trouvé!");
                return res.status(400).json();
            }
            bcrypt.compare(req.body.password, results[0].password) //si non comparer le password avec le hash dans la bdd..
            .then(valid => {
                if(!valid) { //si password invalid..
                    return res.status(401).json({error: 'Mot de passe incorrect!'});
                }
                if(results[0].isAdmin == 0){ // si isAdmin = 0
                    console.log("isadmin:" + results[0].isAdmin);
                    const token = jwt.sign(
                        {userId: results[0].id},
                        'RANDOM_TOKEN_SECRET',
                        {expiresIn: "96h"}
                    );
                    resObject = {
                        username: results[0].username,
                        userId: results[0].id,
                        token: token
                    };
                    res.status(200).json(resObject);
                    next();
                }
                if(results[0].isAdmin == 1){ //si isAdmin = 1 //modifier manuellement la valeur isAdmin d'un  utilisateur a 1 dasn la bdd!
                    const isAdminId = results[0].id+"/isAdmin"
                    console.log(isAdminId)
                    const token = jwt.sign( //signer un nouveau token
                        {userId: isAdminId},
                        'RANDOM_TOKEN_SECRET',
                        {expiresIn: "96h"}
                    );
                    resObject = {
                        username: results[0].username,
                        userId: results[0].id,
                        token: token
                    };
                    res.status(200).json(resObject);
                    next();
                }
                const token = jwt.sign(  //Dans tout les cas generer un nouveau token
                    {userId: results[0].id},
                    'RANDOM_TOKEN_SECRET',
                    {expiresIn: "96h"}
                );
                resObject = { //objet res
                    username: results[0].username,
                    userId: results[0].id,
                    token: token
                };
                res.status(200).json(resObject);
                next();
            })
            .catch(error => res.status(401).json({error}));
        };
    });
}

//supprimer message + compte
exports.deleteUser = (req, res, next) => {
    //console.log("entrer deleteUser: " + req.body);
    connection.query("DELETE FROM message WHERE user_id='"+req.params.id+"';",function(error, results, fields){
        if(error){
        };
        if(results){
            return 1
        };
    });

    deletedUser = "DELETE FROM user WHERE id='"+req.params.id+"';";
    //console.log("deletedUser: " + deletedUser);
    connection.query(deletedUser, function(error, results, fields){
        if(error){
            console.log("compte non supprimé!: " + error);
            res.status(400).json({error});
            return;
        };
        if(results){
            res.status(200).json({message: 'Compte supprimée!'});
            //console.log("compte supprimée!");
            next();
        };
    });
};