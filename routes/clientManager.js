const nmap = require('node-nmap');
const ClientModel = require('../models/client');

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

nmap.nmapLocation = 'nmap';

class ClientManager {
	/**
	 */
	constructor() { }

	/**
	 */
	async networkScan(network_class) {
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

	async findNewClient(network_class = '192.168.1.0') {
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

	/**
	 */
	async getClientList() {
		return ClientModel.getList();
	}

	async get(id) {
		return await ClientModel.get(id);
	}
}

module.exports = ClientManager