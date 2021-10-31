const express = require('express');
const router = express.Router(); //importer Router

const dbConnection = require('../middleware/dbConnection'); //importer dbConnection
const auth = require('../middleware/auth');
const userControllers = require('../controllers/user');

//coder les router
router.post('/signup', userControllers.signUp, userControllers.getUserId); //importer getUserId pour req post!
router.post('/login', userControllers.login);
router.delete('/delete/:id', userControllers.deleteUser,);

module.exports = router;