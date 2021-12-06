var express = require('express');
var router = express.Router();
var client_controller = require('../controllers/client');


/* GET home page. */
router.get('/', client_controller.index);
router.get('/delete/:id', client_controller.delete)
router.get('/findNewClient', client_controller.findNewClient);

module.exports = router;