const express = require('express');
const router = express.Router();

const dbConnection = require('../middleware/dbConnection'); //importer db
const auth = require('../middleware/auth');
const userControllers = require('../controllers/user');

//coder les router
router.post('/signup', userControllers.signUp, userControllers.getUserId); //importer user controller pour post
router.post('/login', userControllers.login);
router.delete('/delete/:id',auth, userControllers.deleteUser,);

module.exports = router;
//terminer