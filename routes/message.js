const express = require('express');
const router = express.Router();

const dbConnection = require('../middleware/dbConnection');//importer db
const auth = require('../middleware/auth');

//coder les router

module.exports = router;