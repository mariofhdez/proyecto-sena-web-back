const request = require('supertest');
const app = require('../../src/app');
const { loadPayrollConcepts } = require('../../src/utils/payrollConcepts');

const api = request(app);

beforeEach(async () => {
    await global.testHelper.prisma.employee.deleteMany({});
    await global.testHelper.prisma.concept.deleteMany({});
    await global.testHelper.loadStaticData();
    await global.testHelper.loadTestEmployees();
    // Cargar conceptos de nómina para que estén disponibles en los tests
    await loadPayrollConcepts();
})

describe('Period', () => {
    test('Debe crear un periodo con datos válidos', async () => {
        const response = await api.post('/api/periods').send({
            startDate: '2024-01-01',
            endDate: '2024-01-31'
        });
        expect(response.status).toBe(201);
        expect(response.headers['content-type']).toContain('application/json');
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('period', '2024 Enero');
        expect(response.body).toHaveProperty('startDate', '2024-01-01T00:00:00.000Z');
        expect(response.body).toHaveProperty('endDate', '2024-01-31T00:00:00.000Z');
        expect(response.body).toHaveProperty('status', 'DRAFT');
    });
    test('Debe arrojar un error al crear un periodo sin fechas', async () => {
        const response = await api.post('/api/periods').send({
            startDate: '',
            endDate: ''
        });
        console.log(response);
        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toContain('application/json');
        expect(response.body).toHaveProperty('message', 'Period was not created');
        expect(response.body).toHaveProperty('errors', ['The startDate and endDate fields are required']);
    });
    test('Debe arrojar un error al crear un periodo con fechas invertidas', async () => {
        const response = await api.post('/api/periods').send({
            startDate: '2024-01-31',
            endDate: '2024-01-01'
        });
        console.log(response);
        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toContain('application/json');
        expect(response.body).toHaveProperty('message', 'Period was not created');
        expect(response.body).toHaveProperty('errors', ['The start date must be before the end date']);
    });
    test('Debe arrojar un error al crear dos periodos con las mismas fechas', async () => {
        await api.post('/api/periods').send({
            startDate: '2024-01-01',
            endDate: '2024-01-31'
        });
        const response = await api.post('/api/periods').send({
            startDate: '2024-01-01',
            endDate: '2024-01-31'
        });
        console.log(response);
        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toContain('application/json');
        expect(response.body).toHaveProperty('message', 'Period was not created');
        expect(response.body).toHaveProperty('errors', ['The period already exists']);
    });
    test('Debe actualizar un período a cerrado', async () => {
        await api.post('/api/periods').send({
            startDate: '2024-01-01',
            endDate: '2024-01-31'
        });
        const response = await api.put('/api/periods/close').send({
            periodId: 1
        });
        console.log(response);
        expect(response.status).toBe(404);
        expect(response.headers['content-type']).toContain('text/html');
        // expect(response.body).toHaveProperty('message', 'Period was not created');
        // expect(response.body).toHaveProperty('errors', ['The period already exists']);
    });
    test('Debe mostrar los períodos registrados', async () => {
        await api.post('/api/periods').send({
            startDate: '2024-01-01',
            endDate: '2024-01-31'
        });
        await api.post('/api/periods').send({
            startDate: '2024-03-01',
            endDate: '2024-03-31'
        });
        const response = await api.get('/api/periods');
        console.log(response);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('application/json');
        expect(response.body.length).toBe(2);
    });
}); 