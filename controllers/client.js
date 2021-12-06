const clientModel = require("../models/client");

exports.index = async function (req, res) {
    var clients = await clientModel.getList();
    res.render('client/index', { clients: clients });
}

exports.delete = async function (req, res) {
    clientModel.delete(req.params.id)
    res.redirect('/client')
}