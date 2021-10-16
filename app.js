const express = require('express'); //app express
const bodyParser = require('body-parser');
const helmet = require("helmet"); //securiser express avec helmet

const app = express();

const userRoutes = require('./routes/user'); //importer les routes
const messageRoutes = require('./routes/message');

//ajout de helmet pour proteger l'app express => configure des entete http appropriee
app.use(helmet());
//ajout des headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/api/user', userRoutes); //utiliser les routes dans notre app
app.use('/api/message', messageRoutes); 

app.use((req, res) => {
    res.json({ message: 'requête reçue !' }); 
});

module.exports = app;
//terminer