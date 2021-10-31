const jwt = require("jsonwebtoken");
//se connecter a la bdd mysql
const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DATABASE,
  insercureAuth: true
});

module.exports = (req, res, next) => {
    if(req.method == "DELETE" || req.method == "PUT"){
        authMessage = "SELECT * FROM message INNER JOIN user ON message.user_id = user.id WHERE message.id="+req.params.id+";";
        //lareqmagique = "SELECT id FROM user WHERE user.id="+req.params.id+";"; //exemple pour authetifier les routes user
        //lareqmagique = "SELECT * FROM user WHERE user.id="+req.params.id+";";
        //console.log("afficher authMessage:" + authMessage);
        connection.query( authMessage ,function(error, results, fields){
            if(error){
                console.log(error);
            };
            if(results){
                //console.log("nombre de lignes: " + results.length); //exemple pour lire les donnees res!
                //console.log("test: " + results[0]["id"]);
                //console.log("test: " + results[0]["user_id"]);
                //console.log("test: " + results[0]["title"]);
                //console.log("test: " + results[0]["content"]);
                console.log("methode: " + req.method);
                const token = req.body.token;
                const tokenDecoded = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
                console.log("tokendecoded: " + tokenDecoded.userId);
                const isAdminUserId = tokenDecoded.userId+'';  // userId = front => vue storage
                console.log(isAdminUserId, "TEST TOKEN");
                const userId = tokenDecoded.userId;
                console.log("userId: " + userId);
                const messageId = results[0]["user_id"]; //user_Id = user_Id envoyer depuis components new message
                console.log("messageId: " + messageId);
                if((tokenDecoded.userId === messageId && req.body.user_id === tokenDecoded.userId )||(isAdminUserId && isAdminUserId.split("/")[1] == "isAdmin")) {
                    console.log("utilisateur authorisé!");
                    next();
                }
                else
                {
                    res.status(401).json({error : "Utilisateur non authorisé!"})
                }
            }
        })
    }
    if(req.method == "POST"){
        console.log(req.method)
        const token = req.body.token;
        console.log("token: " + token);
        const tokenDecoded = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        console.log("tokendecoded: " + tokenDecoded);
        const isAdminUserId = tokenDecoded.userId;
        const userId = tokenDecoded.userId;
        console.log(req.body.user_id, tokenDecoded.userId);
        if(req.body.user_id !== tokenDecoded.userId) {
            res.status(401).json({error : "Utilisateur non authorisé!"})
            return;
        }
        else
        {
            next();
        }
    };
}

//code TEST pour authetifier les routes
/*module.exports = (req, res, next) => {  //middleware pour proteger les routes selectionnee!
    const token = req.headers.authorization.split(' ')[1]; //split pour recuperer tout apres l'espace = deuxieme element du token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //verify pour decoder notre token
    const userId = decodedToken.userId;  //extraiare ID utilisateur de notre token
    if (req.body.userId && req.body.userId !== userId) {
        res.status(401).json({
            error: new Error('Invalid request!')
          });
        throw 'Invalid user ID';
    } else {
        next();
    }
};*/