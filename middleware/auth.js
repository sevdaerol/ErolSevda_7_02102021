//coder jwt pour isAdmin
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
        connection.query("SELECT * FROM message INNER JOIN user ON message.user_id = user.id WHERE message.id="+req.params.id+";",function(error, results, fields){
            if(error){
                
            };
            if(results){
                console.log(req.method)
                const token = req.body.token;
                const tokenDecoded = jwt.verify(token, '')
                const moderationUserId = tokenDecoded.userId+'';
                console.log(tokenDecoded.userId, "TEST TOKEN")
                const userId = decodedToken.userId;
                const messageId = results[0].user_id;
                if((tokenDecoded.userId === messageId && req.body.user_id === tokenDecoded.userId )||(moderationUserId && moderationUserId.split("/")[1] == "moderation")) { 
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
        const tokenDecoded = jwt.verify(token, '')
        const moderationUserId = tokenDecoded.userId;
        const userId = tokenDecoded.userId;
        console.log(req.body.user_id, tokenDecoded.userId)
        if(req.body.user_id !== tokenDecoded.userId) {
            res.status(401).json({error : "Utilisateur non authorisé!"})
        } 
        else
        {
            next();
        }
    };       
}
//terminer