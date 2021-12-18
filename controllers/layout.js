const LayoutModel = require('../models/layout')
const ClientModel = require('../models/client')

const layout = new LayoutModel();
const client = new ClientModel();

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
    console.log(client)
    // TODO: Show client that do not appear in other layouts
    var clients = await client.getList();

    console.log(clients)
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