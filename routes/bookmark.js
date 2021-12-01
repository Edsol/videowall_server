const { prisma } = require('.prisma/client');
var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
var breadcrumb = require('express-url-breadcrumb');

const bookmarkModel = require("../models/bookmark");

/* GET home page. */
router.get('/', async function (req, res, next) {
    var bookmarks = await bookmarkModel.getList();
    res.render('bookmark/index', { bookmarks: bookmarks });
});

router.get('/add', async function (req, res, next) {
    res.render('bookmark/add', { errorMsg: null });
});

var addValidate = [
    body('url').isURL().trim().escape().withMessage('Url is required')
];
router.post('/add', addValidate, async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('bookmark/add', { errors: errors.mapped() })
    } else {

        const response = await bookmarkModel.create(req.body);
        console.log('form valid', req.body, response)
        if (response) {
            res.render('bookmark/add', { saved: true })
        }
    }
});





module.exports = router;