const bookmarkModel = require("../models/bookmark");
const Url = require('url');
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
        // var url = new URL(req.body.url)
        const response = await bookmarkModel.create(req.body);
        if (response) {
            res.render('bookmark/add')
        }
    }
}

exports.delete = async function (req, res) {
    console.log(req.params.id)
    bookmarkModel.delete(req.params.id)
    res.redirect('/bookmark')
}