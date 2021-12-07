const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

class bookmark {
    constructor(args) { }

    static async getList(ecluded) {
        return await prisma.bookmark.findMany({
            orderBy: {
                id: 'desc'
            }
        });
    }

    static async create(data) {
        return await prisma.bookmark.create({
            data: data
        });
    }

    static async get(id) {
        return await prisma.bookmark.findFirst({
            where: {
                id: parseInt(id)
            }
        })
    }

    static async delete(id) {
        return await prisma.bookmark.delete({
            where: {
                id: parseInt(id)
            }
        })
    }
}

module.exports = bookmark