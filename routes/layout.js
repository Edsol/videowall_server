var express = require('express');
var router = express.Router();
var layout_controller = require('../controllers/layout');


/* GET home page. */
router.get('/', layout_controller.index);
router.get('/add', layout_controller.add);
router.post('/saveLayout', layout_controller.saveLayout)

module.exports = router;