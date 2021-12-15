const nmap = require('node-nmap');
const axios = require('axios');

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

exports.pingHost = async (ip, port) => {
    var Telnet = require('telnet-client')
    var connection = new Telnet()

    return new Promise(function (resolve, reject) {
        var params = {
            host: ip,
            port: port,
            shellPrompt: '/ # ', // or negotiationMandatory: false
            timeout: 1500,
            // removeEcho: 4
        }

        connection.connect(params)
            .then(function (prompt) {
                console.log('prompt', prompt)
                connection.exec(cmd)
                    .then(function (res) {
                        // console.log('promises result:', res)
                        resolve(true)
                    })
            }, function (error) {
                resolve(false)
            })
            .catch(function (error) {
                resolve(false)
            })
    })
}

exports.networkScan = async (network_class) => {
    if (network_class === undefined) {
        return [];
    }

    return new Promise(async (resolve, reject) => {
        // var nmapscan = new nmap.QuickScan(network_class);
        var nmapscan = new nmap.NmapScan(network_class, '-sn');
        nmapscan.on('complete', async function (data) {
            var list = [];
            for (const element of data) {
                // if (element.vendor === 'Raspberry Pi Trading' || element.vendor === 'Raspberry Pi Foundation') {
                //     list.push(element)
                // }
            }
            resolve(list)
        });
        nmapscan.on('error', function (error) {
            reject(error)
        });

        nmapscan.startScan();
    })
}

exports.findNewClient = async (req, res) => {
    console.time('find new devices');

    const arp = require('@network-utils/arp-lookup');
    var devices = await arp.getTable();

    var clientPort = global.appPort || 3000;
    var finded = [];
    for (const device of devices) {
        axios.get(`http://${device.ip}:${clientPort}/status`)
            .then(async response => {
                finded.push(device);
                await clientModel.create(device);
            })
            .catch(error => {
                // console.log('error')
            })

        // Find only raspberry divices

        // var regex_1 = new RegExp('^' + 'b8:27:eb', 'i');
        // var regex_2 = new RegExp('^' + 'dc:a6:32', 'i');
        // if ((regex_1.test(device.mac) || regex_2.test(device.mac)) && await clientModel.exists({ mac: device.mac }) === false) {
        //     finded.push(device);
        //     await clientModel.create(device);
        // }
    }
    console.timeEnd('find new devices');

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

exports.favoriteBookmarks = async (req, res) => {
    var all_bookmarks = await bookmarkModel.getList();
    var client = await clientModel.get(req.params.id, { bookmarks: true });

    for (var bookmark of client.bookmarks) {
        all_bookmarks.filter((e, i) => {
            if (e.id === bookmark.id) {
                all_bookmarks.splice(i, 1);
            }
        })
    }

    res.render('client/favoriteBookmarks', {
        thisClient: client,
        bookmarks: all_bookmarks
    })
}

exports.saveFavoriteBookmarks = async (req, res) => {
    var client_id = req.params.id;
    var bookmarks = [];

    await clientModel.disconnectAllBookmark(client_id);
    if (typeof req.body.bookmark === 'string') {
        bookmarks = [{ id: parseInt(req.body.bookmark) }];
    } else if (typeof req.body.bookmark === 'object') {
        req.body.bookmark.forEach(value => {
            bookmarks.push({ id: parseInt(value) })
        })
    }

    await clientModel.connnectBookmark(client_id, bookmarks)
    res.redirect('/client/favoriteBookmarks/' + req.params.id)
}

exports.displayNumber = (req, res) => {
    console.log(req.params.number)
    res.render('displayPage', { number: req.params.number })
}

exports.fillsAllHostname = async (req, res) => {
    await clientModel.fillHostname();
    res.json(true)
}