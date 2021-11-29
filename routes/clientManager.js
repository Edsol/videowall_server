const nmap = require('node-nmap');
const PiClient = require("../models/client");

class ClientManager {
	test_list = [
		new PiClient({
			id: (Math.random() + 1).toString(36).substring(2),
			hostname: 'raspi',
			ip: '192.168.1.28',
			mac: 'DC:A6:32:C9:5F:8A',
		})
	];


	client_list = {};

	/**
	 */
	constructor() { }

	/**
	 * @param  {} data
	 */
	async parseFindResult(data) {
		return new Promise(async (resolve, reject) => {
			var list = [];
			for (const element of data) {
				if (element.vendor === 'Raspberry Pi Trading') {
					var pi_client = new PiClient(element)
					pi_client = await pi_client.init();
					list.push(pi_client)
				}
			}
			resolve(list)
		})
	}

	/**
	 * @param  {} all=false
	 */
	async find(test = false, all = false) {
		var that = this;
		return new Promise(async (resolve, reject) => {
			if (test) {
				// var parsed_data = await that.parseFindResult(this.test_list);
				resolve(this.test_list)
			} else {
				nmap.nmapLocation = 'nmap';
				var nmapscan = new nmap.NmapScan('192.168.1.0/24', '-sPCV');

				nmapscan.on('complete', async function (data) {
					console.log(data)
					if (all === true) {
						resolve(data);
					}

					var parsed_data = await that.parseFindResult(data);
					resolve(parsed_data)
				});
				nmapscan.on('error', function (error) {
					reject(error)
				});

				nmapscan.startScan();
			}

		})
	}

	/**
	 */
	async getClientList(test) {
		var list = await this.find(test);
		for (const element of list) {
			this.client_list[element.id] = element;
		}
		return list;
	}

	getClient(id) {
		return this.client_list[id];
	}

	async remoteCommand(args) {
		var pi_client = this.getClient(args.id);
		if (pi_client) {
			pi_client.openUrl(args.url);
			return true;
		} else if (args.ip_address !== undefined) {
			var pi_client = new PiClient();
			pi_client.openUrl(args.url, args.ip_address)
			return true;
		} else {
			return false;
		}
	}

	async getScreenshot(id) {
		var pi_client = this.getClient(id);
		if (pi_client === undefined) {
			return false;
		}
		return await pi_client.getScreenshot();
	}

	async closeAllRemoteBrowser(id) {
		var pi_client = this.getClient(id);
		console.log(id, pi_client)
		if (pi_client === undefined) {
			return false;
		}

		return await pi_client.closeAllBrowser();
	}

}

module.exports = ClientManager