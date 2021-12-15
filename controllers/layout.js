const LayoutModel = require('../models/layout')

exports.index = async (req, res) => {
    var layouts = await LayoutModel.getList();

    res.render('layout/index', {
        layouts: layouts
    })
}

exports.add = async (req, res) => {
    // var layouts = await LayoutModel.getList();

    res.render('layout/add')
}