const ClientModel = require('../models/client');
const BookmarkModel = require('../models/bookmark');

const client = new ClientModel();

var os = require('os');
var networkInterfaces = os.networkInterfaces();


// exports.getClients = async (req, res) => {
//     var list = await client.getList();
//     res.json(list);
// }

exports.index = async (req, res) => {
    var clients = await client.getList({
        include: {
            bookmarks: true
        }
    });
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
    console.log(req.body)
    var clientObj = await client.get(req.body.id);
    // console.log(clientObj)
    // var client = await client.get(req.body.id);
    var response = await clientObj.openUrl(req.body.url, client.ip_address, req.body.display || 1)
    console.log('openUrl (req.body.url) response', response)
    res.json(response)
}

exports.openBookmark = async (req, res) => {
    var clientObj = await client.get(req.params.client_id, null, true);
    var bookmark = await BookmarkModel.get(req.params.bookmark_id);
    console.log('req.params.display', req.params.display)
    var response = clientObj.openUrl(bookmark.url, client.ip_address, req.params.display || 1)
    res.json(response)
}


/*
* take screenshot of remote client screen
*/
exports.getScreenshot = async (req, res) => {
    var client = await client.get(req.params.id, null, true);
    var base64_image = await client.getScreenshot();
    var base64Data = base64_image.replace(/^data:image\/png;base64,/, "");

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
    var client = await client.get(req.params.id);
    res.json(await client.reboot());
};

/*
* close all browser windows to remote client
*/
exports.closeRemoteBrowser = async (req, res) => {
    var client = await client.get(req.params.id);
    res.json(await client.closeAllBrowser())
};

exports.listClient = async (req, res) => {
    res.json(await client.getList());
}

exports.osd = async (req, res) => {
    var client = await client.get(req.params.id);
    res.json(await client.showOsd(networkInterfaces.enp2s0[0].address + ":3000/client/displayNumber/" + client.id));
}

exports.getConfig = async (req, res) => {
    var client = await client.get(req.params.id);
    res.json(await client.getConfig());
}

exports.broadcast = async (req, res) => {
    var clientList = await client.getList();
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