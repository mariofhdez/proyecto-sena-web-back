const { PrismaClient } = require('../generated/prisma');
const fs = require('fs');

const prisma = new PrismaClient();
const data = JSON.parse(fs.readFileSync('./prisma/staticData.json', 'utf8'));

async function upsertUnique(model, uniqueField, items) {
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

async function main() {
  await upsertUnique('state', 'id', data.departamentos);
  await upsertUnique('city', 'id', data.municipios);
  await upsertUnique('identificationType', 'id', data.tiposIdentificacion);
  await upsertUnique('paymentMethod', 'id', data.metodosPago);
  await upsertUnique('employeeType', 'id', data.tiposTrabajador);
  await upsertUnique('employeeSubtype', 'id', data.subtiposTrabajador);
  await upsertUnique('contractType', 'id', data.tiposContrato);
  await upsertUnique('inabilityType', 'id', data.tiposIncapacidad); // Si no tiene id
//   await upsertUnique('conceptoNomina', 'tipo', data.conceptosNomina); // Si no tiene id
  console.log('Tablas estáticas alimentadas correctamente.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
