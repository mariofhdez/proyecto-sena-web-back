/**
 * @fileoverview Script para alimentar las tablas estáticas de la base de datos
 * @module prisma/seedStatic
 * @requires prisma-client
 * @requires fs
 */

const { PrismaClient } = require('../generated/prisma');
const fs = require('fs');

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
}

/**
 * Función principal que ejecuta la carga de datos en todas las tablas estáticas
 * 
 * @async
 * @function main
 * @returns {Promise<void>}
 */
async function createStaticData() {
  // await upsertUnique('state', 'id', data.departamentos);
  // await upsertUnique('city', 'id', data.municipios);
  // await upsertUnique('identificationType', 'id', data.tiposIdentificacion);
  // await upsertUnique('paymentMethod', 'id', data.metodosPago);
  // await upsertUnique('employeeType', 'id', data.tiposTrabajador);
  // await upsertUnique('EmployeeSubtype', 'id', data.subtiposTrabajador);
  // await upsertUnique('contractType', 'id', data.tiposContrato);
  // await upsertUnique('inabilityType', 'id', data.tiposIncapacidad); // Si no tiene id
  await upsertUnique('PayrollConcept', 'code', data.PayrollConcept); // Si no tiene id
  console.log('Tablas estáticas alimentadas correctamente.');
}

// Ejecuta la función principal y maneja errores
createStaticData()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
