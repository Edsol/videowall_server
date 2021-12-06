const nmap = require('node-nmap');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const clientModel = require("../models/client");

exports.index = async function (req, res) {
    var clients = await clientModel.getList();
    res.render('client/index', { clients: clients });
}

exports.delete = async function (req, res) {
    clientModel.delete(req.params.id)
    res.redirect('/client')
}

exports.findNewClient = async (req, res) => {
    network_class = "192.168.1.0/24"
    console.log(`Find new device in ${network_class} network`)
    var list = await this.networkScan(network_class + "/24");
    console.log('Findend devices', list);

    for (const element of list) {
        if (await clientModel.exists({ mac: element.mac }) === false) {
            await clientModel.create(element);
            console.log(`One device was added (mac: ${element.mac})`)
        }
        //     if (await ClientModel.exists({ mac: element.mac })) {
        //         var existing_client = await prisma.client.findFirst({
        //             where: {
        //                 mac: element.mac
        //             }
        //         });
        //         await ClientModel.updateByMac(existing_client.id, {
        //             hostname: element.hostname,
        //             ip: element.ip
        //         });
        //     } else {
        //         console.log(element)
        //         await ClientModel.create(element);
        //     }
    }
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