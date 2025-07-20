const TestHelper = require('../helpers/testHelper');

// Variable global para el helper de tests
global.testHelper = new TestHelper();

// Setup que se ejecuta antes de cada test
beforeEach(async () => {
    await global.testHelper.setup();
});

// Cleanup que se ejecuta después de cada test
afterEach(async () => {
    await global.testHelper.cleanup();
});

// Teardown que se ejecuta después de todos los tests en un archivo
afterAll(async () => {
    await global.testHelper.teardown();
});

// Configurar timeout global para tests
jest.setTimeout(30000); 