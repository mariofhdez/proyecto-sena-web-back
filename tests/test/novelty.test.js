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

describe('Novelty', () => {
    test('Debe crear una novedad', async () => {
        const employee = await global.testHelper.createTestEmployee({
            salary: 2000000,
            transportAllowance: true
        });

        const concept = await api.get('/api/concepts/code/150');

        const response = await api.post('/api/novelties')
            .send({
                employeeId: employee.id,
                conceptId: concept.body.id,
                date: '2024-01-30',
                value: 100000
            });

        console.log(response.body);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('employeeId', employee.id);
        expect(response.body).toHaveProperty('conceptId', concept.body.id);
        expect(response.body).toHaveProperty('date', '2024-01-30T00:00:00.000Z');
        expect(response.body).toHaveProperty('status', 'PENDING');
        expect(response.body).toHaveProperty('value', 100000);
    })
    test('Debe lanzar un error al crear una novedad sin employeeId', async () => {

        const response = await api.post('/api/novelties')
            .send({
                date: '2024-01-30',
                value: 100000
            });

        console.log(response.body);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Novelty was not created');
        expect(response.body).toHaveProperty('errors', ['The field employeeId is required']);
    })
    test('Debe cambiar el estado de una novedad a APPLIED al generar la liquidación', async () => {
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

        const response = await api
            .post('/api/settlements/settle')
            .send({ settlementId: settlement.body.id });

        console.log(response.body);
        const novelties = await api.get(`/api/novelties/employee/${employee.id}`);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('application/json');

        for (const novelty of novelties.body) {
            expect(novelty.status).toBe('APPLIED');
        }
    })
    test('No debe aplicar una novedad si ya fue aplicada en la liquidación', async () => {
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

        global.testHelper.createTestNovelty({
            employeeId: employee.id,
            conceptId: concept.body.id,
            date: new Date('2024-01-20'),
            value: 100000,
            status: 'APPLIED'
        });

        const settlement = await api.post('/api/settlements')
            .send({
                employeeId: employee.id,
                periodId: period.body.id,
                startDate: '2024-01-01',
                endDate: '2024-01-31',
            });

        const response = await api
            .post('/api/settlements/settle')
            .send({ settlementId: settlement.body.id });

        console.log(response.body);
        const novelties = await api.get(`/api/novelties`);

        const periodNovelties = novelties.body.filter(novelty => novelty.periodId === period.body.id);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('application/json');

        expect(novelties.body.length).toBeGreaterThan(0);
        expect(periodNovelties.length).toBe(0);
    })
    test('No debe aplicar una novedad si posee un estado CANCELLED', async () => {
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

        global.testHelper.createTestNovelty({
            employeeId: employee.id,
            conceptId: concept.body.id,
            date: new Date('2024-01-20'),
            value: 100000,
            status: 'CANCELLED'
        });

        const settlement = await api.post('/api/settlements')
            .send({
                employeeId: employee.id,
                periodId: period.body.id,
                startDate: '2024-01-01',
                endDate: '2024-01-31',
            });

        const response = await api
            .post('/api/settlements/settle')
            .send({ settlementId: settlement.body.id });

        console.log(response.body);
        const novelties = await api.get(`/api/novelties`);

        const periodNovelties = novelties.body.filter(novelty => novelty.periodId === period.body.id);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('application/json');

        expect(novelties.body.length).toBeGreaterThan(0);
        expect(periodNovelties.length).toBe(0);
    })
    test('Debe filtrar las novedades por employeeId y periodId', async () => {
        const employee = await global.testHelper.createTestEmployee({
            salary: 2000000,
            transportAllowance: true
        });
        const employee2 = await global.testHelper.createTestEmployee({
            salary: 1500000,
            transportAllowance: true,
            identification: '1234567890'
        });

        const conceptsEmployee1 = [4, 8, 12, 15]
        const conceptsEmployee2 = [16, 3, 25, 46]

        for (const conceptId of conceptsEmployee1) {
            global.testHelper.createTestNovelty({
                employeeId: employee.id,
                conceptId: conceptId,
                date: new Date('2024-01-20'),
                value: 100000,
                status: 'APPLIED'
            });
        }

        for (const conceptId of conceptsEmployee2) {
            const novelty = global.testHelper.createTestNovelty({
                employeeId: employee2.id,
                conceptId: conceptId,
                date: new Date('2024-01-20'),
                value: 100000,
                status: 'PENDING'
            });
            expect(novelty).toBeTruthy();
        }

        const period = await api.post('/api/periods')
            .send({
                period: '2024-Enero',
                startDate: '2024-01-01',
                endDate: '2024-01-31',
            });

        const settlement = await api.post('/api/settlements')
            .send({
                employeeId: employee2.id,
                periodId: period.body.id,
                startDate: '2024-01-01',
                endDate: '2024-01-31',
            });

        await api.post('/api/settlements/settle')
            .send({ settlementId: settlement.body.id });

        const employeeNovelties = await api.get(`/api/novelties/employee/${employee.id}`);
        const periodNovelties = await api.get(`/api/novelties/period/${period.body.id}`);

        expect(employeeNovelties.body.length).toBe(conceptsEmployee1.length);
        expect(periodNovelties.body.length).toBe(conceptsEmployee2.length);

    })
})