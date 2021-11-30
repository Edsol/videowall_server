var express = require('express');
var router = express.Router();

var bookmarkModel = require("../models/bookmark");

/* GET home page. */
router.get('/', async function (req, res, next) {
    res.render('bookmark/index');
});

module.exports = router;