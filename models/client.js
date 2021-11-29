const axios = require('axios');

class Client {
	#port = 3000;
	hostname = null;
	/**
	 * @param  {} args
	 */

	constructor(args) {
		if (args) {
			this.ip = args.ip
			this.mac = args.mac
			this.id = (Math.random() + 1).toString(36).substring(2);
		}
	}

	/**
	 */
	async init() {
		this.hostname = await this.getHostname();
		this.status = await this.getStatus();
		// xrandr --listmonitors estrae la lista di uscite monitor disponibili

		return this
	}
	/**
	 * @param  {} action
	 * @param  {} type='GET'
	 * @param  {} args={}
	 */
	async doRequest(action, type = 'GET', args = {}) {
		var base_url = `http://${this.ip}:${this.#port}`;
		if (type = 'GET') {
			return axios.get(base_url + '/' + action)
				.then(response => {
					return response.data
				})
		}
		if (type = 'POST') {
			return axios.post(base_url + '/' + action, args)
				.then(response => {
					return response.data
				})
		}

	}
	/**
	 */
	async getHostname() {
		return await this.doRequest('hostname');
	}
	/**
	 */
	async getStatus() {
		return await this.doRequest('status');
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

	async getScreenshot() {
		return await this.doRequest('screenshot/1');
	}

	async closeAllBrowser() {
		return await this.doRequest('closeBrowser')
	}

}

module.exports = Client