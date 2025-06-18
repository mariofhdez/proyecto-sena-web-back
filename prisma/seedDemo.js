const { PrismaClient } = require('../generated/prisma');
const fs = require('fs');
const settlementNewService = require('../src/services/settlementNewService');
const { validateSettlementNewCreation } = require('../src/utils/settlementNewValidation');

const prisma = new PrismaClient();

const demo = JSON.parse(fs.readFileSync('./prisma/demoData.json', 'utf8'));

async function insertEmployees(model, uniqueField, items) {
    for (const item of items) {
        const where = {};
        where[uniqueField] = item[uniqueField];
        await prisma[model].upsert({
            where,
            update: {},
            create: item,
        });
    }
}

async function insertNews(items) {
    for (const item of items) {
        const data = await validateSettlementNewCreation(item);
        const createdSettlementNew = await settlementNewService.create(data);
        if (!createdSettlementNew) throw new Error('Settlement new was not created');
    }
}

async function insertDemoData() {
    await insertEmployees('employee', 'identification', demo.employees);
    await insertNews(demo.news);
}

insertDemoData()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });