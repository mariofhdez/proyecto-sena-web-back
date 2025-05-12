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
  await upsertUnique('departamento', 'id', data.departamentos);
  await upsertUnique('ciudad', 'id', data.municipios);
  await upsertUnique('tipoIdentificacion', 'id', data.tiposIdentificacion);
  await upsertUnique('metodoPago', 'id', data.metodosPago);
  await upsertUnique('tipoTrabajador', 'id', data.tiposTrabajador);
  await upsertUnique('subtipoTrabajador', 'id', data.subtiposTrabajador);
  await upsertUnique('tipoContrato', 'id', data.tiposContrato);
  await upsertUnique('tipoIncapacidad', 'id', data.tiposIncapacidad); // Si no tiene id
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
