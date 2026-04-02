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

describe('Liquidación', () => {
    test('Generar liquidación solo con conceptos regulares', async () => {
        const employee = await global.testHelper.createTestEmployee({
            salary: 2000000,
            transportAllowance: true
        });

        const period = await api.post('/api/periods')
            .send({
                period: '2024-Enero',
                startDate: '2024-01-01',
                endDate: '2024-01-31',
            });

        const settlement = await api.post('/api/settlements')
            .send({
                employeeId: employee.id,
                periodId: period.body.id,
                startDate: '2024-01-01',
                endDate: '2024-01-31',
            });

        expect(settlement.status).toBe(201);
        expect(settlement.headers['content-type']).toContain('application/json');
        expect(settlement.body).toHaveProperty('id');
        expect(settlement.body).toHaveProperty('employeeId', employee.id);
        expect(settlement.body).toHaveProperty('periodId', period.body.id);
        expect(settlement.body).toHaveProperty('startDate', '2024-01-01T00:00:00.000Z');
        expect(settlement.body).toHaveProperty('endDate', '2024-01-31T00:00:00.000Z');
        expect(settlement.body).toHaveProperty('status', 'DRAFT');
        expect(settlement.body).toHaveProperty('totalValue', 0);
        expect(settlement.body).toHaveProperty('details', []);

        const response = await api
            .post('/api/settlements/settle')
            .send({ settlementId: settlement.body.id });

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('application/json');
        expect(response.body.details.length).toBe(4);
        expect(response.body.earningsValue).toBe(2200000);
        expect(response.body.deductionsValue).toBe(160000);
        expect(response.body.totalValue).toBe(2040000);
    })
    test('Generar liquidación con novedades', async () => {
        const employee = await global.testHelper.createTestEmployee({
            salary: 2000000,
            transportAllowance: true
        });

        const period = await api.post('/api/periods')
            .send({
                period: '2024-Enero',
                startDate: '2024-01-01',
                endDate: '2024-01-31',
            });

        const concept = await api.get('/api/concepts/code/150');

        await api.post('/api/novelties')
            .send({
                employeeId: employee.id,
                conceptId: concept.body.id,
                date: '2024-01-20',
                value: 100000
            });

        const settlement = await api.post('/api/settlements')
            .send({
                employeeId: employee.id,
                periodId: period.body.id,
                startDate: '2024-01-01',
                endDate: '2024-01-31',
            });

        expect(settlement.status).toBe(201);
        expect(settlement.headers['content-type']).toContain('application/json');
        expect(settlement.body).toHaveProperty('id');
        expect(settlement.body).toHaveProperty('employeeId', employee.id);
        expect(settlement.body).toHaveProperty('periodId', period.body.id);
        expect(settlement.body).toHaveProperty('startDate', '2024-01-01T00:00:00.000Z');
        expect(settlement.body).toHaveProperty('endDate', '2024-01-31T00:00:00.000Z');
        expect(settlement.body).toHaveProperty('status', 'DRAFT');
        expect(settlement.body).toHaveProperty('totalValue', 0);
        expect(settlement.body).toHaveProperty('details', []);

        const response = await api
            .post('/api/settlements/settle')
            .send({ settlementId: settlement.body.id });

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('application/json');
        expect(response.body.details.length).toBe(5);
        expect(response.body.earningsValue).toBe(2300000);
        expect(response.body.deductionsValue).toBe(160000);
        expect(response.body.totalValue).toBe(2140000);
    })
    test('Debe arrojar un error al generar una liquidación de un empleado inactivo', async () => {
        const employee = await global.testHelper.createTestEmployee({
            salary: 2000000,
            transportAllowance: true,
            isActive: false
        });

        const period = await api.post('/api/periods')
            .send({
                period: '2024-Enero',
                startDate: '2024-01-01',
                endDate: '2024-01-31',
            });

        const concept = await api.get('/api/concepts/code/150');

        await api.post('/api/novelties')
            .send({
                employeeId: employee.id,
                conceptId: concept.body.id,
                date: '2024-01-20',
                value: 100000
            });

        const settlement = await api.post('/api/settlements')
            .send({
                employeeId: employee.id,
                periodId: period.body.id,
                startDate: '2024-01-01',
                endDate: '2024-01-31',
            });

        expect(settlement.status).toBe(400);
        expect(settlement.headers['content-type']).toContain('application/json');
        expect(settlement.body).toHaveProperty('message', 'The employee is inactive');
    })
    test('Debe arrojar un error al calcular una liquidación de una liquidación cerrada', async () => {
        const employee = await global.testHelper.createTestEmployee({
            salary: 2000000,
            transportAllowance: true
        });

        const period = await api.post('/api/periods')
            .send({
                period: '2024-Enero',
                startDate: '2024-01-01',
                endDate: '2024-01-31',
                status: 'CLOSED'
            });

        const settlement = await api.post('/api/settlements')
            .send({
                employeeId: employee.id,
                periodId: period.body.id,
                startDate: '2024-01-01',
                endDate: '2024-01-31',
            });

        expect(settlement.status).toBe(201);
        expect(settlement.headers['content-type']).toContain('application/json');

        const settle = await api
            .post('/api/settlements/settle')
            .send({ settlementId: settlement.body.id });

        expect(settle.status).toBe(200);
        expect(settle.headers['content-type']).toContain('application/json');

        const closedSettlement = await api
            .post('/api/settlements/close')
            .send({settlementId: settlement.body.id});
        expect(closedSettlement.status).toBe(200);
        expect(closedSettlement.headers['content-type']).toContain('application/json');
        expect(closedSettlement.body).toHaveProperty('status', 'CLOSED');
        

        const reopenSettlement = await api
            .post('/api/settlements/settle')
            .send({settlementId: settlement.body.id});
        expect(reopenSettlement.status).toBe(400);
        expect(reopenSettlement.headers['content-type']).toContain('application/json');
        expect(reopenSettlement.body).toHaveProperty('message', 'Payroll was not settled');
        expect(reopenSettlement.body).toHaveProperty('errors', ['Payroll with id \'' + settlement.body.id + '\' is closed']);
    })
    test('Debe arrojar un error al crear una liquidación duplicada', async () => {
        const employee = await global.testHelper.createTestEmployee({
            salary: 2000000,
            transportAllowance: true
        });

        const period = await api.post('/api/periods')
            .send({
                period: '2024-Enero',
                startDate: '2024-01-01',
                endDate: '2024-01-31',
            });

        const settlement = await api.post('/api/settlements')
            .send({
                employeeId: employee.id,
                periodId: period.body.id,
                startDate: '2024-01-01',
                endDate: '2024-01-31',
            });

        expect(settlement.status).toBe(201);
        expect(settlement.headers['content-type']).toContain('application/json');
        expect(settlement.body).toHaveProperty('id');
        expect(settlement.body).toHaveProperty('employeeId', employee.id);
        expect(settlement.body).toHaveProperty('periodId', period.body.id);
        expect(settlement.body).toHaveProperty('startDate', '2024-01-01T00:00:00.000Z');
        expect(settlement.body).toHaveProperty('endDate', '2024-01-31T00:00:00.000Z');
        expect(settlement.body).toHaveProperty('status', 'DRAFT');
        expect(settlement.body).toHaveProperty('totalValue', 0);
        expect(settlement.body).toHaveProperty('details', []);

        const secondSettlement = await api.post('/api/settlements')
        .send({
            employeeId: employee.id,
            periodId: period.body.id,
            startDate: '2024-01-01',
            endDate: '2024-01-31',
        });

        expect(secondSettlement.status).toBe(400);
        expect(secondSettlement.headers['content-type']).toContain('application/json');
        expect(secondSettlement.body).toHaveProperty('message', 'Settlement was not created');
        expect(secondSettlement.body).toHaveProperty('errors', ['The settlement for the period already exists']);
    })
    test('Al crearse una liquidación debe presentar un estado DRAFT', async () => {
        const employee = await global.testHelper.createTestEmployee({
            salary: 2000000,
            transportAllowance: true
        });

        const period = await api.post('/api/periods')
            .send({
                period: '2024-Enero',
                startDate: '2024-01-01',
                endDate: '2024-01-31',
            });

        const settlement = await api.post('/api/settlements')
            .send({
                employeeId: employee.id,
                periodId: period.body.id,
                startDate: '2024-01-01',
                endDate: '2024-01-31',
            });

        expect(settlement.status).toBe(201);
        expect(settlement.headers['content-type']).toContain('application/json');
        expect(settlement.body).toHaveProperty('id');
        expect(settlement.body).toHaveProperty('employeeId', employee.id);
        expect(settlement.body).toHaveProperty('periodId', period.body.id);
        expect(settlement.body).toHaveProperty('startDate', '2024-01-01T00:00:00.000Z');
        expect(settlement.body).toHaveProperty('endDate', '2024-01-31T00:00:00.000Z');
        expect(settlement.body).toHaveProperty('status', 'DRAFT');
        expect(settlement.body).toHaveProperty('totalValue', 0);
        expect(settlement.body).toHaveProperty('details', []);
    })
    test('Los cálculos de los totales de la liquidación deben ser correctos', async () => {
        const employee = await global.testHelper.createTestEmployee({
            salary: 2000000,
            transportAllowance: true
        });

        const period = await api.post('/api/periods')
            .send({
                period: '2024-Enero',
                startDate: '2024-01-01',
                endDate: '2024-01-31',
            });

        const settlement = await api.post('/api/settlements')
            .send({
                employeeId: employee.id,
                periodId: period.body.id,
                startDate: '2024-01-01',
                endDate: '2024-01-31',
            });

        expect(settlement.status).toBe(201);
        expect(settlement.headers['content-type']).toContain('application/json');
        expect(settlement.body).toHaveProperty('id');
        expect(settlement.body).toHaveProperty('employeeId', employee.id);
        expect(settlement.body).toHaveProperty('periodId', period.body.id);
        expect(settlement.body).toHaveProperty('startDate', '2024-01-01T00:00:00.000Z');
        expect(settlement.body).toHaveProperty('endDate', '2024-01-31T00:00:00.000Z');
        expect(settlement.body).toHaveProperty('status', 'DRAFT');
        expect(settlement.body).toHaveProperty('totalValue', 0);
        expect(settlement.body).toHaveProperty('details', []);

        const response = await api
            .post('/api/settlements/settle')
            .send({ settlementId: settlement.body.id });

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('application/json');
        expect(response.body.details.length).toBe(4);
        expect(response.body.earningsValue).toBe(2200000);
        expect(response.body.deductionsValue).toBe(160000);
        expect(response.body.totalValue).toBe(2040000);
    })
    test('Debe arrojar un error cuando las deducciones superen el valor de los ingresos', async () => {
        const employee = await global.testHelper.createTestEmployee({
            salary: 2000000,
            transportAllowance: true
        });

        const period = await api.post('/api/periods')
            .send({
                period: '2024-Enero',
                startDate: '2024-01-01',
                endDate: '2024-01-31',
            });

        const concept = await api.get('/api/concepts/code/256');

        await api.post('/api/novelties')
            .send({
                employeeId: employee.id,
                conceptId: concept.body.id,
                date: '2024-01-20',
                value: 3000000
            });

        const settlement = await api.post('/api/settlements')
            .send({
                employeeId: employee.id,
                periodId: period.body.id,
                startDate: '2024-01-01',
                endDate: '2024-01-31',
            });

        expect(settlement.status).toBe(201);
        expect(settlement.headers['content-type']).toContain('application/json');
        expect(settlement.body).toHaveProperty('id');
        expect(settlement.body).toHaveProperty('employeeId', employee.id);
        expect(settlement.body).toHaveProperty('periodId', period.body.id);
        expect(settlement.body).toHaveProperty('startDate', '2024-01-01T00:00:00.000Z');
        expect(settlement.body).toHaveProperty('endDate', '2024-01-31T00:00:00.000Z');
        expect(settlement.body).toHaveProperty('status', 'DRAFT');
        expect(settlement.body).toHaveProperty('totalValue', 0);
        expect(settlement.body).toHaveProperty('details', []);

        const response = await api
            .post('/api/settlements/settle')
            .send({ settlementId: settlement.body.id });

        expect(response.status).toBe(400);
        expect(response.headers['content-type']).toContain('application/json');
        expect(response.body).toHaveProperty('message', 'Payroll was not settled');
        expect(response.body).toHaveProperty('errors', ['Deductions exceed the value of earnings']);

        const settlementDetails = await api.get(`/api/settlement-details/settlement/${settlement.body.id}`);
        expect(settlementDetails.body.length).toBe(0);

        const novelties = await api.get(`/api/novelties/employee/${employee.id}`);
        expect(novelties.body.length).toBe(1);
        // expect(novelties.body[0].status).toBe('PENDING');
    })
})