var express = require('express');
var router = express.Router();
var client_controller = require('../controllers/client');


/* GET home page. */
router.get('/', client_controller.index);

module.exports = router;