const axios = require('axios');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

class Client {
	#port = 3000;
	hostname = null;
	/**
	 * @param  {} args
	 */

	constructor(args) {
		if (args) {
			this.id = args.id
			this.ip = args.ip
			this.mac = args.mac
		}
	}

	static async getList() {
		return await prisma.client.findMany()
	}

	static async get(id, includes = null, return_object = true) {
		var client = await prisma.client.findFirst({
			where: {
				id: parseInt(id)
			},
			include: includes
		});

		if (return_object) {
			return new Client(client);
		}
		return client;
	}

	static async exists(args = {}) {
		var count = await prisma.client.count({
			where: args
		})

		return count === 0 ? false : true;
	}

	static async create(args) {
		return await prisma.client.create({
			data: {
				hostname: args.hostname,
				ip: args.ip,
				mac: args.mac,
				alias: ""
			}
		})
	}

	static async updateByMac(id, data) {
		return await prisma.client.update({
			where: {
				id: id
			},
			data: data
		});
	}

	async setField(id, field, value) {
		return await prisma.client.update({
			where: {
				id: parseInt(id)
			},
			data: {
				[field]: value
			}
		});
	}

	static async find(args, includes) {
		return await prisma.client.findFirst({
			where: args,
			include: includes
		})
	}

	static async disconnectAllBookmark(id) {
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

	static async connnectBookmark(id, bookmark_ids) {
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
	async openUrl(url, ip) {
		var ip_address = ip !== undefined ? ip : this.ip;
		if (ip_address === undefined) {
			return false;
		}
		return axios.post(`http://${ip_address}:${this.#port}` + '/run', {
			url: url
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