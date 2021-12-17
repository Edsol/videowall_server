const LayoutModel = require('../models/layout')
const ClientModel = require('../models/client')

const layout = new LayoutModel();

exports.index = async (req, res) => {
    var layouts = await layout.getList({
        include: {
            rows: true
        }
    });

    res.render('layout/index', {
        layouts: layouts
    })
}

exports.add = async (req, res) => {
    // TODO: Show client that do not appear in other layouts
    var clients = await layout.getList({
        include: {
            rows: true
        }
    });
    res.render('layout/add', {
        clients: clients
    })
}

exports.saveLayout = async (req, res) => {
    var layoutName = req.body.name;
    var data = req.body.data;

    LayoutModel.create(layoutName, data);
    res.json(true)
}