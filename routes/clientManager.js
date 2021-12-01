const nmap = require('node-nmap');
const ClientModel = require('../models/client');

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();


class ClientManager {
	client_list = {};

	ClientModel = new ClientModel();

	/**
	 */
	constructor() { }

	/**
	 */
	async networkScan(network_class) {
		if (network_class === undefined) {
			return [];
		}
		var that = this;
		return new Promise(async (resolve, reject) => {
			nmap.nmapLocation = 'nmap';
			var nmapscan = new nmap.NmapScan(network_class, '-sPCV');

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
			if (await this.ClientModel.exists({ mac: element.mac })) {
				var existing_client = await prisma.client.findFirst({
					where: {
						mac: element.mac
					}
				});
				await this.ClientModel.updateByMac(existing_client.id, {
					hostname: element.hostname,
					ip: element.ip
				});
			} else {
				await this.ClientModel.create(element);
			}
		}
		return list;
	}

	/**
	 */
	async getClientList() {
		return this.ClientModel.getList();
	}

	async get(id) {
		var client = await this.ClientModel.get(id);
		return new ClientModel(client);
	}

	// getClient(id) {
	// 	return this.client_list[id];
	// }

	// async remoteCommand(args) {
	// 	var pi_client = this.getClient(args.id);
	// 	if (pi_client) {
	// 		pi_client.openUrl(args.url);
	// 		return true;
	// 	} else if (args.ip_address !== undefined) {
	// 		var pi_client = new Client();
	// 		pi_client.openUrl(args.url, args.ip_address)
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// }

	// async getScreenshot(id) {
	// 	var pi_client = this.getClient(id);
	// 	if (pi_client === undefined) {
	// 		return false;
	// 	}
	// 	return await pi_client.getScreenshot();
	// }

	// async closeAllRemoteBrowser(id) {
	// 	var pi_client = this.getClient(id);
	// 	console.log(id, pi_client)
	// 	if (pi_client === undefined) {
	// 		return false;
	// 	}

	// 	return await pi_client.closeAllBrowser();
	// }

}

module.exports = ClientManager