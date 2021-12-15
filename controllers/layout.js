const LayoutModel = require('../models/layout')
const ClientModel = require('../models/client')

exports.index = async (req, res) => {
    var layouts = await LayoutModel.getList();

    res.render('layout/index', {
        layouts: layouts
    })
}

exports.add = async (req, res) => {
    // TODO: Show client that do not appear in other layouts
    var clients = await ClientModel.getList();
    res.render('layout/add', {
        clients: clients
    })
}

exports.saveLayout = async (req, res) => {
    var layoutName = req.body.name;
    var data = req.body.data;

    for (var row of data) {
        console.log(row)
        for (var id of row) {
            console.log(id)
        }
    }
    res.json(true)
}