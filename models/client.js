const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const Table = require('./table');
const prisma = new PrismaClient();

class Client extends Table {
	tableName = 'client';
	#port = 3000;
	hostname = null;
	/**
	 * @param  {} args
	 */

	constructor(args) {
		super();
		if (args) {
			this.id = args.id
			this.ip = args.ip
			this.mac = args.mac
			this.bookmarks = args.bookmarks
		}
	}

	// async getList() {
	// 	return await prisma.client.findMany({
	// 		include: {
	// 			bookmarks: true
	// 		}
	// 	})
	// }

	async get(id, includes) {
		var client = await super.get(id, includes)
		return new Client(client);
	}

	// async exists(args = {}) {
	// 	var count = await prisma.client.count({
	// 		where: args
	// 	})

	// 	return count === 0 ? false : true;
	// }

	// async create(args) {
	// 	return await prisma.client.create({
	// 		data: {
	// 			hostname: args.hostname,
	// 			ip: args.ip,
	// 			mac: args.mac,
	// 			displayNumber: args.displayNumber,
	// 			alias: ""
	// 		}
	// 	})
	// }

	async updateByMac(id, data) {
		return await prisma.client.update({
			where: {
				id: id
			},
			data: data
		});
	}

	// async setField(id, field, value) {
	// 	return await prisma.client.update({
	// 		where: {
	// 			id: parseInt(id)
	// 		},
	// 		data: {
	// 			[field]: value
	// 		}
	// 	});
	// }

	// async find(args, includes) {
	// 	return await prisma.client.findFirst({
	// 		where: args,
	// 		include: includes
	// 	})
	// }

	async disconnectAllBookmark(id) {
		return await prisma.client.update({
			where: {
				id: parseInt(id)
			},
			data: {
				bookmarks: {
					set: []
				}
			}
		})
	}

	async connnectBookmark(id, bookmark_ids) {
		return await prisma.client.update({
			where: {
				id: parseInt(id)
			},
			data: {
				bookmarks: {
					connect: bookmark_ids
				}
			}
		})
	}

	async fillHostname() {
		var clients = await prisma.client.findMany({
			where: {
				hostname: null
			}
		})

		var updated = 0;

		for (var client of clients) {
			client = new Client(client);
			var client_config = await client.getConfig();

			if (client_config.hostname) {
				client.setField(client.id, 'hostname', client_config.hostname)
				updated++;
			}
		}
		return updated;
	}
	/**
	 */
	async init() {
		this.hostname = await this.getHostname();
		this.status = await this.getStatus();
		// xrandr --listmonitors estrae la lista di uscite monitor disponibili

		return this
	}

	async getClient(id) {
		var client = await prisma.client.findUnique({
			where: {
				id: parseInt(id)
			}
		});

		return new Client(client);
	}
	/**
	 * @param  {} action
	 * @param  {} type='GET'
	 * @param  {} args={}
	 */
	async doRequest(action, type = 'GET', args = {}) {
		var base_url = `http://${this.ip}:${this.#port}`;
		var url = base_url + '/' + action;
		if (type = 'GET') {
			return axios.get(url, { timeout: 5000 })
				.then(response => {
					return response.data
				}).catch(error => {
					console.log('doRequest axios error', error.code)
					return error.code
				})
		}
		if (type = 'POST') {
			return axios.post(base_url + '/' + action, args)
				.then(response => {
					return response.data
				}).catch(error => {
					return error.code
				})
		}

	}
	/**
	 */
	async getHostname() {
		var hostname = await this.doRequest('hostname');
		return hostname !== 'ECONNABORTED' ? hostname : '';
	}
	/**
	 */
	async getStatus() {
		var status = await this.doRequest('status');
		return status !== 'ECONNABORTED' ? status : '';
	}
	/**
	 * @param  {} url
	 * @param  {} ip
	 */
	async openUrl(url, ip, display = 0) {
		var ip_address = ip !== undefined ? ip : this.ip;
		if (ip_address === undefined) {
			return false;
		}
		console.log('client openUrl', `http://${ip_address}:${this.#port}` + '/openUrl')
		return axios.post(`http://${ip_address}:${this.#port}` + '/openUrl', {
			url: url,
			display: display
		})
			.then(response => {
				return response.data
			})
	}

	async getScreenshot(base64 = true) {
		return await this.doRequest('screenshot/' + base64);
	}

	async closeAllBrowser() {
		return await this.doRequest('closeBrowser')
	}

	async reboot() {
		return await this.doRequest('reboot');
	}

	async showOsd(url) {
		console.log(this.id)
		// return await this.doRequest('osd/' + text)
		return await this.openUrl(url);
	}

	async getConfig() {
		return await this.doRequest('getConfig');
	}

	static async delete(id) {
		return await prisma.client.delete({
			where: {
				id: parseInt(id)
			}
		})
	}

}

module.exports = Client