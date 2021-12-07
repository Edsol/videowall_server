const nmap = require('node-nmap');

const clientModel = require("../models/client");
const bookmarkModel = require("../models/bookmark");

exports.index = async function (req, res) {
    var clients = await clientModel.getList();
    res.render('client/index', { clients: clients });
}

exports.delete = async function (req, res) {
    clientModel.delete(req.params.id)
    res.redirect('/client')
}

exports.findNewClient = async (req, res) => {
    console.time('find new devices');

    //TODO: 1746ms
    const arp = require('@network-utils/arp-lookup');
    // var result = await arp.fromPrefix('b8:27:eb')
    // console.log('result', result)
    // result = await arp.fromPrefix('dc:a6:32')
    // console.log('result', result)
    // console.timeEnd('find new devices');
    //TODO: 886.098ms
    var devices = await arp.getTable();
    var finded = [];
    for (const device of devices) {
        var regex_1 = new RegExp('^' + 'b8:27:eb', 'i');
        var regex_2 = new RegExp('^' + 'dc:a6:32', 'i');
        if ((regex_1.test(device.mac) || regex_2.test(device.mac)) && await clientModel.exists({ mac: device.mac }) === false) {
            finded.push(device);
            await clientModel.create(device);
        }
    }
    console.timeEnd('find new devices');

    //TODO: 1100.558ms
    // const find = require('local-devices');
    // find('192.168.1.0/24', true).then(async devices => {
    //     var finded = [];
    //     for (const device of devices) {
    //         var regex_1 = new RegExp('^' + 'b8:27:eb', 'i');
    //         var regex_2 = new RegExp('^' + 'dc:a6:32', 'i');
    //         if ((regex_1.test(device.mac) || regex_2.test(device.mac)) && await clientModel.exists({ mac: device.mac }) === false) {
    //             finded.push(device);
    //             await clientModel.create(device);
    //         }

    //     }
    //     console.timeEnd('find new devices');
    //     console.log('devices finded', finded)
    //     res.json(true);
    // })


    //TODO: 16681.268ms
    // network_class = "192.168.1.0/24"
    // console.log(`Find new device in ${network_class} network`)
    // var list = await this.networkScan(network_class + "/24");
    // console.log('Findend devices', list);

    // for (const element of list) {
    //     if (await clientModel.exists({ mac: element.mac }) === false) {
    //         await clientModel.create(element);
    //         console.log(`One device was added (mac: ${element.mac})`)
    //     }
    // }
    res.json(true);
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
                    list.push(element)
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

exports.favoriteBookmarks = async (req, res) => {
    var all_bookmarks = await bookmarkModel.getList();

    var client = await clientModel.get(req.params.id, {
        BookmarksClients: {
            include: {
                bookmark: true
            }
        }
    });

    console.log(client)

    res.render('client/favoriteBookmarks', {
        thisClient: client,
        bookmarks: all_bookmarks
    })
}

exports.saveFavoriteBookmarks = async (req, res) => {
    var client_id = req.params.id;
    var bookmarks = req.body.bookmark
    console.log(client_id, bookmarks)
    bookmarks = 4
    var clients = await clientModel.connnectBookmark(client_id, bookmarks)

    // this.favoriteBookmarks(req, res)
    // res.redirect('/client/favoriteBookmarks/' + req.params.id)
}