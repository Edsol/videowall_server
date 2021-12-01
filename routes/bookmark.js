var express = require('express');
var router = express.Router();
var bookmark_controller = require('../controllers/bookmark');

const { body } = require('express-validator');

/* GET home page. */
router.get('/', bookmark_controller.index);
router.get('/add', bookmark_controller.add);

var addValidate = [
    body('url').isURL().trim().escape().withMessage('Url is required')
];
router.post('/add', addValidate, bookmark_controller.save);

module.exports = router;