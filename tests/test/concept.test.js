const request = require('supertest');
const app = require('../../src/app');

const api = request(app);

beforeEach(async() => {
    await global.testHelper.prisma.concept.deleteMany({});
    await global.testHelper.loadStaticData();
})

describe('Concept', () => {
    test('Obtener todos los conceptos configurados en la base de datos', async() => {
        const response = await api.get('/api/concepts')
        .expect(200)
        .expect('Content-Type', /application\/json/);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(60);
    })
    test('Obtener concepto por su id', async() => {
        const retrieveResponse = await api.get('/api/concepts')
        .expect(200)
        .expect('Content-Type', /application\/json/);

        const concept = retrieveResponse.body[0];
        const response = await api.get(`/api/concepts/${concept.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

        expect(response.body).toEqual(concept);
    })
    test('Obtener concepto por su código', async() => {
        const response = await api.get(`/api/concepts/code/127`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

        expect(response.body.code).toEqual('127');
        expect(response.body.name).toEqual('Auxilio de transporte');
        expect(response.body.type).toEqual('DEVENGADO');
        expect(response.body.calculationType).toEqual('LINEAL');
        expect(response.body.base).toEqual('ALLOWANCE');
        expect(response.body.divisor).toEqual(30);
        expect(response.body.isIncome).toEqual(true);
    })
})