const express = require('express');
const router = express.Router();

const dbConnection = require('../middleware/dbConnection');//importer db
const auth = require('../middleware/auth');
const messageControllers = require('../controllers/message');

//coder les router
router.get('/', messageControllers.getAllMessage);
router.get('/:id', messageControllers.getMessageById,);
router.get('/:id', messageControllers.getMessageUsername,);
router.post('/', auth, messageControllers.createMessage,);
router.put('/:id', messageControllers.modifyMessage,);
router.delete('/:id', messageControllers.deleteMessage,);

module.exports = router;