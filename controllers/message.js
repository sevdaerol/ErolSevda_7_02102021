const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DATABASE,
    insercureAuth: true
});

//eviter attaques par injections SQL = connection.escape(req)

//recuperer tout les messages => AS = alias  => ici tout le contenue de la table message + message.id = message_id
exports.getAllMessage = (req, res, next) =>{
    //console.log("entrer dans recupererMessage: " + req.body);
    allMessage = "SELECT *, message.id AS message_id FROM message INNER JOIN user ON message.user_id = user.id;";
    //console.log("tout les messages: " + allMessage);
    connection.query( allMessage,
        function(error, results, fields){
        if(error){
            console.log("erreur du contenue de la requete!" + error);
            res.status(400).json({error});
        };
        if(results){
            res.status(200).json(results);
            //console.log("Resultats du getallmessage: " + results[1]["title"]);  //exemple de console.log pour lire les donnees recu = > ici title
        };
    });
}
//
//recuperer message par id
exports.getMessageById = (req, res, next) => {
    connection.query("SELECT * FROM message INNER JOIN user ON message.user_id = user.id WHERE message.id = " + connection.escape(req.params.id), function(error, results, fields){
        if(error){
            res.status(400).json({error});
        };
        if(results){
            res.status(200).json(results);
        };
    });
};

//recuperer le nom d'utilisateur dans message
exports.getMessageUsername = (req, res, next) => {
    connection.query('SELECT username FROM user WHERE id = ' + connection.escape(req.params.id), function(error, results, fields){
        if(error){
            console.log(error);
            res.status(400).json({content: "Utilisateur non trouvé!"});
            next();
        };
        if(results){
            res.status(200).json(results);
            next();
        }
    });
}

//creer un message
exports.createMessage = (req, res, next) => {
    //console.log("entrer dans createMessage: " + req.body);
    newMessage = "INSERT INTO message VALUES (NULL, " + connection.escape(req.body.user_id) +", " + connection.escape(req.body.title) +", " + connection.escape(req.body.content) +", NOW());";
    //console.log("ma requete: " + newMessage);
    connection.query( newMessage
    ,function(error, results, fields){
        if(error){
            console.log("erreur du contenue de la requete!" + error);
            res.status(400).json({error});
            //next();
            return; // utiliser return et non next() pour eviter les "err_http_headers_sent" = quand le serveur envoi plus d'un response au front
        };
        if(results){
            res.status(201).json({content: "Nouveau message crée!"});
            next();
        };
    });
};

//modifier un message
exports.modifyMessage = (req, res, next) => {
    let modify = 'UPDATE message'+' SET content= "'+ connection.escape(req.body.content) +'", datetime=NOW() WHERE id= ' + connection.escape(req.params.id) ;
    connection.query( modify
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
    connection.query("DELETE FROM message WHERE id = " + connection.escape(req.params.id), function(error, results, fields){
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