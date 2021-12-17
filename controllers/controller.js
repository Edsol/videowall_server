const ClientModel = require('../models/client');
const BookmarkModel = require('../models/bookmark');

var os = require('os');
var networkInterfaces = os.networkInterfaces();


// exports.getClients = async (req, res) => {
//     var list = await ClientModel.getList();
//     res.json(list);
// }

exports.index = async (req, res) => {
    var clients = await ClientModel.getList();
    var bookmarks = await BookmarkModel.getList();

    await req.flash('info', 'Flash is back!');
    // const messages = await req.consumeFlash('info');
    res.render('controller/index', {
        clients: clients,
        bookmarks: bookmarks,
        // messages
    });
}

/*
* open page in remote browser
*/
exports.openUrl = async (req, res) => {
    var client = await ClientModel.get(req.body.id, null, true);
    var response = client.openUrl(req.body.url, client.ip_address, req.body.display || 0)
    res.json(response)
}

exports.openBookmark = async (req, res) => {
    var client = await ClientModel.get(req.params.client_id, null, true);
    var bookmark = await BookmarkModel.get(req.params.bookmark_id);
    var response = client.openUrl(bookmark.url, client.ip_address)
    res.json(response)
}


/*
* take screenshot of remote client screen
*/
exports.getScreenshot = async (req, res) => {
    var client = await ClientModel.get(req.params.id, null, true);
    var base64_image = await client.getScreenshot();
    var base64Data = base64_image.replace(/^data:image\/png;base64,/, "");
    // console.log('base64Data', base64Data)
    var file_path = "screenshot/" + client.mac.replace(/:/g, '_') + ".png";
    require("fs").writeFile('./public/' + file_path, base64Data, 'base64', function (err) {
        if (err) {
            console.log('error while saving the image', err);
        } else {
            client.setField(client.id, 'screenshotPath', file_path)
        }
    });

    res.json(base64_image);
}

/*
* reboot remote device
*/
exports.reboot = async (req, res) => {
    var client = await ClientModel.get(req.params.id);
    res.json(await client.reboot());
};

/*
* close all browser windows to remote client
*/
exports.closeRemoteBrowser = async (req, res) => {
    var client = await ClientModel.get(req.params.id);
    res.json(await client.closeAllBrowser())
};

exports.listClient = async (req, res) => {
    res.json(await ClientModel.getList());
}

exports.osd = async (req, res) => {
    var client = await ClientModel.get(req.params.id);
    res.json(await client.showOsd(networkInterfaces.enp2s0[0].address + ":3000/client/displayNumber/" + client.id));
}

exports.getConfig = async (req, res) => {
    var client = await ClientModel.get(req.params.id);
    res.json(await client.getConfig());
}

exports.broadcast = async (req, res) => {
    var clientList = await ClientModel.getList();
    for (var client of clientList) {
        var clientObject = new ClientModel(client);
        switch (req.params.action) {
            case 'showOsd':
                clientObject.openUrl(networkInterfaces.enp2s0[0].address + ":3000/client/displayNumber/" + client.id)
                break;

            case 'closeBrowser':
                clientObject.closeAllBrowser();
                break;
        }
    }

}