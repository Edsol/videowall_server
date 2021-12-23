const axios = require('axios');

const clientModel = require("../models/client");
const bookmarkModel = require("../models/bookmark");

var clientPort = global.appPort || 3000;

const client = new clientModel();

exports.index = async function (req, res) {
    var clients = await client.getList({
        include: {
            displays: true
        }
    });
    res.render('client/index', { clients: clients });
}

exports.delete = async function (req, res) {
    client.delete(req.params.id)
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

async function parseClient(device) {
    var deviceParsed = {
        ip: device.ip,
        mac: device.mac,
        displays: {
            create: []
        }
    };

    var hostnameData = await axios.get(`http://${device.ip}:${clientPort}/hostname`);
    deviceParsed.hostname = hostnameData.data.replace(/\s+/g, ' ').trim();

    var displayData = await axios.get(`http://${device.ip}:${clientPort}/getMonitors`);

    displayData.data.forEach((element, index) => {
        element.index = element.id;
        delete element.id;
        deviceParsed.displays.create.push(element);
    })

    return deviceParsed
}

exports.findNewClient = async (req, res) => {
    console.time('find new devices');

    const arp = require('@network-utils/arp-lookup');
    var devices = await arp.getTable();

    var finded = [];
    for (const device of devices) {
        axios.get(`http://${device.ip}:${clientPort}/status`)
            .then(async response => {
                console.log('Device response', device.ip)
                var deviceParsed = await parseClient(device)

                var saved = await client.create({ data: deviceParsed });
                finded.push(saved);
            })
            .catch(error => { })
    }
    console.timeEnd('find new devices');
    res.json(true);
}

exports.favoriteBookmarks = async (req, res) => {
    var all_bookmarks = await bookmarkModel.getList();

    var clientObj = await client.get(req.params.id, { bookmarks: true });
    console.log(clientObj)
    if (clientObj.bookmarks !== undefined) {
        for (var bookmark of clientObj.bookmarks) {
            all_bookmarks.filter((e, i) => {
                if (e.id === bookmark.id) {
                    all_bookmarks.splice(i, 1);
                }
            })
        }
    }

    res.render('client/favoriteBookmarks', {
        thisClient: clientObj,
        bookmarks: all_bookmarks
    })
}

exports.saveFavoriteBookmarks = async (req, res) => {
    var client_id = req.params.id;
    var bookmarks = [];

    await client.disconnectAllBookmark(client_id);
    if (typeof req.body.bookmark === 'string') {
        bookmarks = [{ id: parseInt(req.body.bookmark) }];
    } else if (typeof req.body.bookmark === 'object') {
        req.body.bookmark.forEach(value => {
            bookmarks.push({ id: parseInt(value) })
        })
    }

    await client.connnectBookmark(client_id, bookmarks)
    res.redirect('/client/favoriteBookmarks/' + req.params.id)
}

exports.displayNumber = (req, res) => {
    res.render('displayPage', { number: req.params.number })
}

exports.displayPosition = async (req, res) => {
    var displayObj = await client.get(req.params.id);

    res.render('client/displayPosition', {
        clientId: req.params.id,
        display: displayObj,
        monitors: await displayObj.getMonitors()
    })
}

exports.saveDisplayPosition = async (req, res) => {
    var clientObj = await client.get(req.params.id);
    var response = await clientObj.setPlaceByPort(req.body.second, req.body.place, req.body.main);
    console.log('response', response)
    res.json(true);
}

exports.fillsAllHostname = async (req, res) => {
    await client.fillHostname();
    res.json(true)
}