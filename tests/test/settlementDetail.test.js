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

describe('Settlement Detail', () => {
    test('Debe crear un detalle de liquidación para un concepto lineal', async () => {
        const employee = await global.testHelper.createTestEmployee({
            salary: 2000000,
            transportAllowance: true
        });


        const settlement = await api.post('/api/settlements')
        .send({
            employeeId: employee.id,
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            status: 'OPEN'
        });

        const concept = await api.get('/api/concepts/code/101');

        console.log(settlement.body);
        console.log(concept.body);
        const response = await api
            .post('/api/settlement-details')
            .send({
                settlementId: settlement.body.id,
                employeeId: employee.id,
                conceptId: concept.body.id,
                value: 100000,
                quantity: 1,
                date: '2024-01-30'
            });



        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('settlementId', settlement.body.id);
        expect(response.body).toHaveProperty('conceptId', concept.body.id);
        expect(response.body).toHaveProperty('value', 100000);
        expect(response.body).toHaveProperty('quantity', 1);
        expect(response.body).toHaveProperty('status', 'DRAFT');
        expect(response.body).toHaveProperty('employeeId', employee.id);
    })
    test('Debe crear un detalle de liquidación para un concepto nominal', async () => {
        const employee = await global.testHelper.createTestEmployee({
            salary: 2000000,
            transportAllowance: true
        });


        const settlement = await api.post('/api/settlements')
        .send({
            employeeId: employee.id,
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            status: 'OPEN'
        });

        const concept = await api.get('/api/concepts/code/102');

        console.log(settlement.body);
        console.log(concept.body);
        const response = await api
            .post('/api/settlement-details')
            .send({
                settlementId: settlement.body.id,
                employeeId: employee.id,
                conceptId: concept.body.id,
                value: 100000,
                quantity: 1,
                date: '2024-01-30'
            });



        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('settlementId', settlement.body.id);
        expect(response.body).toHaveProperty('conceptId', concept.body.id);
        expect(response.body).toHaveProperty('value', 100000);
        expect(response.body).toHaveProperty('quantity', 1);
        expect(response.body).toHaveProperty('status', 'DRAFT');
        expect(response.body).toHaveProperty('employeeId', employee.id);
    })
    test('Debe crear un detalle de liquidación para un concepto factorial', async () => {
        const employee = await global.testHelper.createTestEmployee({
            salary: 2000000,
            transportAllowance: true
        });


        const settlement = await api.post('/api/settlements')
        .send({
            employeeId: employee.id,
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            status: 'OPEN'
        });

        const concept = await api.get('/api/concepts/code/110');

        console.log(settlement.body);
        console.log(concept.body);
        const response = await api
            .post('/api/settlement-details')
            .send({
                settlementId: settlement.body.id,
                employeeId: employee.id,
                conceptId: concept.body.id,
                value: 100000,
                quantity: 1,
                date: '2024-01-30'
            });



        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('settlementId', settlement.body.id);
        expect(response.body).toHaveProperty('conceptId', concept.body.id);
        expect(response.body).toHaveProperty('value', 100000);
        expect(response.body).toHaveProperty('quantity', 1);
        expect(response.body).toHaveProperty('status', 'DRAFT');
        expect(response.body).toHaveProperty('employeeId', employee.id);
    })
    test('Debe estar relacionado con una liquidación de nómina', async () => {
        const employee = await global.testHelper.createTestEmployee({
            salary: 2000000,
            transportAllowance: true
        });


        const settlement = await api.post('/api/settlements')
        .send({
            employeeId: employee.id,
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            status: 'OPEN'
        });

        const concept = await api.get('/api/concepts/code/110');

        console.log(settlement.body);
        console.log(concept.body);
        const response = await api
            .post('/api/settlement-details')
            .send({
                settlementId: settlement.body.id,
                employeeId: employee.id,
                conceptId: concept.body.id,
                value: 100000,
                quantity: 1,
                date: '2024-01-30'
            });



        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('settlementId', settlement.body.id);
        expect(response.body).toHaveProperty('conceptId', concept.body.id);
        expect(response.body).toHaveProperty('value', 100000);
        expect(response.body).toHaveProperty('quantity', 1);
        expect(response.body).toHaveProperty('status', 'DRAFT');
        expect(response.body).toHaveProperty('employeeId', employee.id);
    })
    test('Debe lanzar un error al tratar de crear un detalle de mómina con cantidad 0', async () => {
        const employee = await global.testHelper.createTestEmployee({
            salary: 2000000,
            transportAllowance: true
        });


        const settlement = await api.post('/api/settlements')
        .send({
            employeeId: employee.id,
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            status: 'OPEN'
        });

        const concept = await api.get('/api/concepts/code/110');

        console.log(settlement.body);
        console.log(concept.body);
        const response = await api
            .post('/api/settlement-details')
            .send({
                settlementId: settlement.body.id,
                employeeId: employee.id,
                conceptId: concept.body.id,
                value: 100000,
                quantity: 0,
                date: '2024-01-30'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'SettlementDetail was not created');
        expect(response.body).toHaveProperty('errors', ['The quantity cannot be 0']);
    })
    test('Debe marcar los detalles de liquidación como CLOSED cuando se cierra la liquidación', async () => {
        const employee = await global.testHelper.createTestEmployee({
            salary: 2000000,
            transportAllowance: true
        });

        const settlement = await api.post('/api/settlements')
        .send({
            employeeId: employee.id,
            startDate: '2024-01-01',
            endDate: '2024-01-31',
        });

        await api
            .post('/api/settlements/settle')
            .send({settlementId: settlement.body.id});

        await api
            .post('/api/settlements/close')
            .send({settlementId: settlement.body.id});

        const details = await api.get(`/api/settlement-details/settlement/${settlement.body.id}`);

        expect(details.status).toBe(200);
        for(const detail of details.body) {
            expect(detail.status).toBe('CLOSED');
        }
    })
});