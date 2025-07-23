const request = require('supertest');
const app = require('../../src/app');
const employeeService = require('../../src/services/employeeService');

const api = request(app);

beforeEach(async() => {
    await global.testHelper.prisma.employee.deleteMany({});
    await global.testHelper.prisma.concept.deleteMany({});
    const employees = await global.testHelper.loadTestEmployees();
    await global.testHelper.loadStaticData();
    const concept = await global.testHelper.prisma.concept.findFirst({
        where: {
            code: '102'
        }
    });
    console.log(concept);
    await global.testHelper.loadTestNovelties(employees[1].id, concept.id);
})

describe('Employee', () => {
    test('Crear un empleado con datos válidos', async() => {
        const employeeData = {
            identification: '12345678',
            firstName: 'Juan',
            otherNames: 'Francisco',
            firstSurname: 'Pérez',
            secondSurname: 'García',
            salary: 1500000,
            transportAllowance: true,
            position: 'Seller'
        }
        const response = await api.post('/api/employees')
        .send(employeeData)
        .expect(201)
        .expect('Content-Type', /application\/json/);
        expect(response.body).toHaveProperty('id');
        expect(response.body.identification).toBe(employeeData.identification);
        expect(response.body.firstName).toBe(employeeData.firstName);
        expect(response.body.otherNames).toBe(employeeData.otherNames);
        expect(response.body.firstSurname).toBe(employeeData.firstSurname);
        expect(response.body.secondSurname).toBe(employeeData.secondSurname);
        expect(response.body.salary).toBe(employeeData.salary);
        expect(response.body.transportAllowance).toBe(employeeData.transportAllowance);
        expect(response.body.position).toBe(employeeData.position);
    })
    test('Crear un empleado sin datos requeridos', async() => {
        const employeeData = {
            identification: '',
            firstName: 'Juan',
            otherNames: 'Francisco',
            firstSurname: 'Pérez',
            secondSurname: 'García',
            salary: 1500000,
            transportAllowance: true,
            position: 'Seller'
        }
        const response = await api.post('/api/employees')
        .send(employeeData)
        .expect(400)
        .expect('Content-Type', /application\/json/);
        expect(response.body.message).toBe('Employee was not created');
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors.length).toBe(1);
        expect(response.body.errors[0]).toBe('The field identification is required');
    })
    test('Crear un empleado con salario 0', async() => {
        const employeeData = {
            identification: '777',
            firstName: 'Juan',
            otherNames: 'Francisco',
            firstSurname: 'Pérez',
            secondSurname: 'García',
            salary: 0,
            transportAllowance: true,
            position: 'Seller'
        }
        const response = await api.post('/api/employees')
        .send(employeeData)
        .expect(400)
        .expect('Content-Type', /application\/json/);
        expect(response.body.message).toBe('Employee was not created');
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors.length).toBe(1);
        expect(response.body.errors[0]).toBe('The field salary is required');
    })
    test('Crear un empleado con identificación duplicada', async() => {
        const employeeData = {
            identification: '123',
            firstName: 'Juan',
            otherNames: 'Francisco',
            firstSurname: 'Pérez',
            secondSurname: 'García',
            salary: 1500000,
            transportAllowance: true,
            position: 'Seller'
        }
        const response = await api.post('/api/employees')
        .send(employeeData)
        .expect(400)
        .expect('Content-Type', /application\/json/);
        expect(response.body.message).toBe('Employee was not created');
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors.length).toBe(1);
        expect(response.body.errors[0]).toBe(`The employee with identification '${employeeData.identification}' already exists`);
    })
    test('Actualizar datos de un empleado', async() => {
        const employees = await employeeService.getAll();
        const employeeData = {
            identification: '1234',
            firstName: 'Juan',
            otherNames: 'Francisco',
            firstSurname: 'Pérez',
            secondSurname: 'García',
        }
        const response = await api
        .patch(`/api/employees/${employees[0].id}`)
        .send(employeeData)
        .expect(200)
        .expect('Content-Type', /application\/json/);
        expect(response.body).toHaveProperty('id');
        expect(response.body.firstName).toBe(employeeData.firstName);
        expect(response.body.otherNames).toBe(employeeData.otherNames);
        expect(response.body.firstSurname).toBe(employeeData.firstSurname);
        expect(response.body.secondSurname).toBe(employeeData.secondSurname);
    })
    test('Desactivar un empleado', async() => {
        const employees = await employeeService.getAll();
        const response = await api
        .patch(`/api/employees/${employees[0].id}`)
        .send({isActive: false})
        .expect(200)
        .expect('Content-Type', /application\/json/);
        expect(response.body).toHaveProperty('id');
        expect(response.body.isActive).toBe(false);
    })
    test('Eliminar empleado sin novedades ni liquidaciones', async() => {
        const employees = await employeeService.getAll();
        const response = await api
        .delete(`/api/employees/${employees[0].id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
        expect(response.body.message).toBe('Employee was deleted');
    })
    test('Eliminar empleado con novedades', async() => {
        const employees = await employeeService.getAll();
        const response = await api
        .delete(`/api/employees/${employees[1].id}`)
        .expect(400)
        .expect('Content-Type', /application\/json/);
        expect(response.body.message).toBe('Employee was not deleted');
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors.length).toBe(1);
        expect(response.body.errors[0]).toBe('The employee has novelties');
    })
    test('Crear un empleado sin datos opcionales', async() => {
        const employeeData = {
            identification: '444',
            firstName: 'Juan',
            firstSurname: 'Pérez',
            salary: 1500000,
            transportAllowance: true
        }
        const response = await api.post('/api/employees')
        .send(employeeData)
        .expect(201)
        .expect('Content-Type', /application\/json/);
        expect(response.body).toHaveProperty('id');
        expect(response.body.identification).toBe(employeeData.identification);
        expect(response.body.firstName).toBe(employeeData.firstName);
        expect(response.body.firstSurname).toBe(employeeData.firstSurname);
        expect(response.body.salary).toBe(employeeData.salary);
    })
    test('Crear empleado con valor booleano false', async() => {
        const employeeData = {
            identification: '888',
            firstName: 'Juan',
            firstSurname: 'Pérez',
            salary: 1500000,
            transportAllowance: false
        }
        const response = await api.post('/api/employees')
        .send(employeeData)
        .expect(201)
        .expect('Content-Type', /application\/json/);
        expect(response.body).toHaveProperty('id');
        expect(response.body.transportAllowance).toBe(false);
    })
})