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
    bcrypt.hash(req.body.password, 10)
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

//fonction pour trouver par id lutilisateur
exports.getUserId = (req, res, next) => {
    connection.query('SELECT id FROM user WHERE username="'+req.body.username+'";', function(error, results, fields){
        if (error) {
            res.status(402).json({error});
        };
        if(results){
            console.log("test pour trouver par id")
            const token = jwt.sign(
                {userId: results[0].user_id},
                '', //random token
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
        if(results){
            if(results[0].password == undefined | results[0].email == undefined){
                console.log("Utilisateur non trouvé!");
                return res.status(401).json();
            }
            bcrypt.compare(req.body.password, results[0].password)
            .then(valid => {
                if(!valid) {
                    return res.status(401).json({error: 'Mot de passe incorrect!'});
                }
                if(results[0].isAdmin == 0){
                    console.log(results[0].id)
                    const token = jwt.sign(
                        {userId: results[0].id},
                        '', //random token
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
                if(results[0].isAdmin == 1){
                    const isAdminId = results[0].id+"/isAdmin"
                    console.log(isAdminId)
                    const token = jwt.sign(
                        {userId: isAdminId},
                        '',
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
                const token = jwt.sign(
                    {userId: results[0].id},
                    '',
                    {expiresIn: "96h"}
                );
                resObject = {
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