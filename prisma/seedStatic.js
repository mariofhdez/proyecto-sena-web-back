/**
 * @fileoverview Script para alimentar las tablas estáticas de la base de datos
 * @module prisma/seedStatic
 * @requires prisma-client
 * @requires fs
 */

const { PrismaClient } = require('../generated/prisma');
const fs = require('fs');
const bcrypt = require('bcryptjs');

/**
 * Instancia del cliente Prisma para interactuar con la base de datos
 * @type {PrismaClient}
 */
const prisma = new PrismaClient();

/**
 * Datos estáticos cargados desde un archivo JSON
 * @type {Object}
 */
const data = JSON.parse(fs.readFileSync('./prisma/staticData.json', 'utf8'));

/**
 * Inserta o actualiza registros en una tabla específica basándose en un campo único
 * 
 * @async
 * @function upsertUnique
 * @param {string} model - Nombre del modelo de Prisma a utilizar
 * @param {string} uniqueField - Campo que se utilizará como identificador único
 * @param {Array<Object>} items - Arreglo de objetos con los datos a insertar o actualizar
 * @returns {Promise<void>}
 */
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
  console.log(`${model} alimentadas correctamente.`);
}

/**
 * Función principal que ejecuta la carga de datos en todas las tablas estáticas
 * 
 * @async
 * @function main
 * @returns {Promise<void>}
 */
// async function createStaticData() {
//   // await upsertUnique('employee', 'identification', demo.employees);
//   // await upsertUnique('settlementNew', 'conceptId', demo.news);
//   // await upsertUnique('identificationType', 'id', data.tiposIdentificacion);
//   // await upsertUnique('paymentMethod', 'id', data.metodosPago);
//   // await upsertUnique('employeeType', 'id', data.tiposTrabajador);
//   // await upsertUnique('EmployeeSubtype', 'id', data.subtiposTrabajador);
//   // await upsertUnique('contractType', 'id', data.tiposContrato);
//   // await upsertUnique('inabilityType', 'id', data.tiposIncapacidad); // Si no tiene id
// }

async function createUser() {
  const adminExists = await prisma.user.findUnique({
    where: {
      email: 'admin@admin.com',
    },
  });
  if (adminExists) return;
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@admin.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log('Usuario administrador creado correctamente.');
}

async function main() {
  await createUser();
  await upsertUnique('concept', 'code', data.payrollConcept); // Si no tiene id
}

// Ejecuta la función principal y maneja errores
main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
