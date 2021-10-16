const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DATABASE,
    insercureAuth: true
});

//recuperer tout les messages = contenue posts => AS = alias pour creer tableau d'ensemble de tout le contenue => message_id
exports.getAllMessage = (req, res, next) =>{
    connection.query('SELECT *, message.id AS message_id FROM message INNER JOIN user ON message.user_id = user.id;', function(error, results, fields){
        if(error){
            res.status(400).json({error});
        };
        if(results){
            res.status(200).json(results);
        };
    });
}

//recuperer message par id
exports.getMessageById = (req, res, next) => {
    connection.query("SELECT * FROM message INNER JOIN user ON message.user_id = user.id WHERE message.id="+req.params.id+";",function(error, results, fields){
        if(error){
            res.status(400).json({error});
        };
        if(results){
            res.status(200).json(results);         
        };
    });
};

//creer un message
exports.createMessage = (req, res, next) => {
    console.log(req.body);
    connection.query('INSERT INTO message '+
                    'VALUES (NULL,'+req.body.user_id+',"'+req.body.title+'","'+req.body.content+'");'
    ,function(error, results, fields){
        if(error){
            res.status(400).json({error});
            next();
        };
        if(results){
            res.status(201).json({content: "Nouveau message crée!"});
            next();
        };
    });
};

//modifier un message
exports.modifyMessage = (req, res, next) => {
    connection.query('UPDATE message'+
                    ' SET content="'+req.body.content+'", WHERE id='+req.params.id+';'
    ,function(error, results, fields){
        if(error){
            res.status(400).json({error});
        };
        if(results){
            res.status(200).json({content: "Message modifié!"});
        };
    });
};

//supprimer message
exports.deleteMessage = (req, res, next) => {
    connection.query("DELETE FROM message WHERE id="+req.params.id+";",function(error, results, fields){
        if(error){
            res.status(400).json({error});
            next();
        };
        if(results){
            res.status(200).json({content: "Message supprimé!"});
            next();
        };
    });
};

//recuperer le nom d'utilisateur dans message
exports.getMessageUsername = (req, res, next) => {
    connection.query('SELECT username FROM user WHERE id='+req.params.id, function(error, results, fields){
        if(error){
            console.log(error);
            res.status(401).json({content: "Utilisateur non trouvé!"});
            next();
        };
        if(results){
            res.status(202).json(results);
            next();
        }
    });
}
//terminer