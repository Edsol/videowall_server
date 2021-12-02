const bookmarkModel = require("../models/bookmark");
const { validationResult } = require('express-validator');

exports.index = async function (req, res) {
    var bookmarks = await bookmarkModel.getList();
    res.render('bookmark/index', { bookmarks: bookmarks });
}

exports.add = async function (req, res, next) {
    res.render('bookmark/add', { errorMsg: null });
}

exports.save = async function (req, res, next) {
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
}