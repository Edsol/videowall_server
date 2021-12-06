const clientModel = require("../models/client");

exports.index = async function (req, res) {
    var clients = await clientModel.getList();
    res.render('client/index', { clients: clients });
}