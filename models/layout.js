const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

class Layout {
	constructor() { }

	static async getList() {
		return await prisma.layout.findMany({
			include: {
				rows: true
			}
		});
	}

	static async create(name, data) {
		var rows = [];

		for (var [row_id, row] of data.entries()) {
			var columns = [];
			for (var [col_id, client_id] of row.entries()) {
				columns.push({
					position: col_id,
					clientId: client_id
				});
			}
			rows.push({
				position: row_id,
				columns: {
					create: columns
				}
			})
		}

		return await prisma.layout.create({
			data: {
				name: name,
				rows: {
					create: rows
				}
			}
		})

		// return await prisma.layout.create({
		// 	data: {
		// 		name: name,
		// 		rows: {
		// 			create: [
		// 				{
		// 					position: 2,
		// 					columns: {
		// 						create: [
		// 							{
		// 								position: 3,
		// 								clientId: 1
		// 							}
		// 						]
		// 					}
		// 				}
		// 			],

		// 		}
		// 	}
		// })
	}
}

module.exports = Layout;