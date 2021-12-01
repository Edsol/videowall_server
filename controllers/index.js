const nmap = require('node-nmap');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const ClientModel = require('../models/client');


// exports.getClients = async (req, res) => {
//     var list = await ClientModel.getList();
//     res.json(list);
// }

exports.showClients = async (req, res) => {
    var clients = await ClientModel.getList();
    res.render('index/index', { clients: clients });
}

/*
* open page in remote browser
*/
exports.openUrl = async (req, res) => {
    var client = await ClientModel.get(req.body.id);
    var response = client.openUrl(req.body.url, client.ip_address)
    res.json(response)
}

/*
* take screenshot of remote client screen
*/
exports.getScreenshot = async (req, res) => {
    var client = await ClientModel.get(req.params.id);
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

exports.findNewClient = async (req, res) => {
    network_class = "192.168.1.0/24"
    console.log(network_class)
    var list = await this.networkScan(network_class + "/24");
    for (const element of list) {
        if (await ClientModel.exists({ mac: element.mac })) {
            var existing_client = await prisma.client.findFirst({
                where: {
                    mac: element.mac
                }
            });
            await ClientModel.updateByMac(existing_client.id, {
                hostname: element.hostname,
                ip: element.ip
            });
        } else {
            console.log(element)
            await ClientModel.create(element);
        }
    }
    return list;
}

exports.networkScan = async (req, res) => {
    if (network_class === undefined) {
        return [];
    }
    return new Promise(async (resolve, reject) => {
        var nmapscan = new nmap.QuickScan(network_class);
        nmapscan.on('complete', async function (data) {
            var list = [];
            for (const element of data) {
                if (element.vendor === 'Raspberry Pi Trading' || element.vendor === 'Raspberry Pi Foundation') {

                    var pi_client = new ClientModel(element)
                    pi_client = await pi_client.init();
                    list.push(pi_client)
                }
            }
            resolve(list)
        });
        nmapscan.on('error', function (error) {
            reject(error)
        });

        nmapscan.startScan();
    })
}

exports.osd = async (req, res) => {
    var client = await ClientModel.get(req.params.id);
    res.json(await client.showOsd('TEST'));
}