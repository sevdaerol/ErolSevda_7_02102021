const express = require('express');
const router = express.Router(); //importer router

const dbConnection = require('../middleware/dbConnection');//importer dbConnection
const auth = require('../middleware/auth'); //importer middleware auth pour authetifier les routes
const messageControllers = require('../controllers/message');

//coder les router
router.get('/', messageControllers.getAllMessage);
router.get('/:id', messageControllers.getMessageById,);
router.get('/:id', messageControllers.getMessageUsername,);
router.post('/', auth, messageControllers.createMessage,); //authentifier les routes
router.put('/:id', auth, messageControllers.modifyMessage,);
router.delete('/:id', auth, messageControllers.deleteMessage,);

module.exports = router;