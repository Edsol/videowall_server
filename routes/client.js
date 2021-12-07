var express = require('express');
var router = express.Router();
var client_controller = require('../controllers/client');


/* GET home page. */
router.get('/', client_controller.index);
router.get('/delete/:id', client_controller.delete)
router.get('/findNewClient', client_controller.findNewClient);

router.get('/favoriteBookmarks/:id', client_controller.favoriteBookmarks);
router.post('/favoriteBookmarks/:id', client_controller.saveFavoriteBookmarks);
router.get('/displayNumber/:number', client_controller.displayNumber)
module.exports = router;