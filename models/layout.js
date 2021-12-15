const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

class Layout {
    constructor() { }

    static async getList() {
        return prisma.layout.findMany({
            include: {
                bookmarks: true
            }
        });
    }
}

module.exports = Layout;