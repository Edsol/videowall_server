const Table = require('./table');

class Layout extends Table {
	tableName = 'layout';

	constructor() {
		super();
	}

	async create(name, data) {
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
	}
}

module.exports = Layout;