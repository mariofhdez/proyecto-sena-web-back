const { generateToken } = require("../../src/middlewares/auth");
const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../../src/app');
const userService = require('../../src/services/userService');

const api = request(app);

beforeEach(async() => {
    console.log('🔄 Iniciando beforeEach...');
    await global.testHelper.prisma.user.deleteMany({});
    console.log('️ Base de datos limpiada');
    
    console.log('👥 Creando usuarios de prueba...');
    const users = await global.testHelper.createAuthTestUsers();
    console.log(`✅ Usuarios creados: ${users.length}`);
    
    // Verificar que realmente existen
    const count = await global.testHelper.prisma.user.count();
    console.log(`📊 Total usuarios en BD: ${count}`);
})

describe('Auth', () =>{
    test('Login exitoso con credenciales correctas', async() =>{
        console.log(' Ejecutando test de login...');
        // Verificar usuarios antes del test
        const userCount = await global.testHelper.prisma.user.count();
        console.log(` Usuarios antes del test: ${userCount}`);
        const response = await api
            .post('/api/auth/login')
            .send({
                email: 'test-admin@email.com',
                password: 'admin123'
            })
            .expect(200)
            .expect('Content-Type', /application\/json/);
            expect(response.body.token).toBeDefined();
    })
    test('Login fallido por contraseña incorrecta', async() =>{
        const response = await api
            .post('/api/auth/login')
            .send({
                email: 'test-admin@email.com',
                password: 'wrong-password'
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);
            expect(response.body.message).toBe('Access denied');
            expect(response.body.errors[0]).toBe('Invalid email or password');
    })
    test('Login fallido por email no registrado', async() =>{
        const response = await api
            .post('/api/auth/login')
            .send({
                email: 'test-admin-not-registered@email.com',
                password: 'admin123'
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);
            expect(response.body.message).toBe('Access denied');
            expect(response.body.errors[0]).toBe('Invalid email or password');
    })
    test('Login fallido por campos incompletos', async() =>{
        const response = await api
            .post('/api/auth/login')
            .send({
                email: '',
                password: ''
            })
            .expect(400)
            .expect('Content-Type', /application\/json/);
            expect(response.body.message).toBe('Access denied');
            expect(response.body.errors[0]).toBe('The field email is required');
    })
    test('Token generado contiene los datos completos', async() => {
        const response = await api
            .post('/api/auth/login')
            .send({
                email: 'test-admin@email.com',
                password: 'admin123'
            });
        const token = response.body.token;
        const decoded = await api.post('/api/auth/validate')
            .send({
                token: token
            })
            .expect(200)
            .expect('Content-Type', /application\/json/);
        expect(decoded.body.user.email).toBe('test-admin@email.com');
        expect(decoded.body.user.role).toBe('ADMIN');
        expect(decoded.body.user.isActive).toBe(true);
        expect(decoded.body.user.iat).toBeDefined();
        expect(decoded.body.user.exp).toBeDefined();
    })
    test('Acceso a ruta protegida con token inválido', async() => {
        const loginResponse = await api
        .post('/api/auth/login')
        .send({
            email: 'test-user@email.com',
            password: 'user123'
        });
        const token = loginResponse.body.token;
        const response = await api
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
        expect(response.body.message).toBe('You are not authorized to access this resource');
    })
    test('Acceso a ruta protegida con token caducado', async() => {
        const users = await userService.getUsersService();
        const token = jwt.sign(
            {
                id: users[0].id,
                email: users[0].email,
                role: users[0].role,
                isActive: users[0].isActive,
                exp: Math.floor(Date.now() / 1000) - 1
            },
            process.env.JWT_SECRET,
            {
                algorithm: 'HS256'
            }
        );

        const response = await api
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .expect(403)
            .expect('Content-Type', /application\/json/);
        expect(response.body.message).toBe('jwt expired');
    })
    test('Acceso a ruta protegida sin token', async() => {
        const response = await api
            .get('/api/users')
            .set('Authorization', `Bearer`)
            .expect(403)
            .expect('Content-Type', /application\/json/);
        expect(response.body.message).toBe('jwt must be provided');
    })
    test('El token tiene una vigencia de 1 hora', async() => {
        const response = await api
            .post('/api/auth/login')
            .send({
                email: 'test-admin@email.com',
                password: 'admin123'
            });
        const token = response.body.token;
        const decoded = await api.post('/api/auth/validate')
            .send({
                token: token
            })
            .expect(200)
            .expect('Content-Type', /application\/json/);
        const exp = decoded.body.user.exp;
        const iat = decoded.body.user.iat;
        expect(exp - iat).toBe(3600);
    })
});

describe('Register', () => {
    test('Registro exitoso con datos válidos', async() =>{
        const newUser = {
            email: 'jhon-doe@test.com',
            password: 'test1234',
            name: 'Jhon Doe',
            role: 'USER',
            isActive: true
        }
        const response = await api
            .post('/api/auth/register')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        expect(response.body.message).toBe(`User: ${newUser.name} was created successfully!`);
    })
    test('Registro fallido por email ya registrado', async() =>{
        const newUser = {
            email: 'test-admin@email.com',
            password: 'test1234',
            name: 'Test Admin',
            role: 'USER',
            isActive: true
        }
        const response = await api
            .post('/api/auth/register')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        expect(response.body.message).toBe('User creation failed');
        expect(response.body.errors[0]).toBe('This email is already registered');
    })
    test('Registro fallido por rol forzado por el usuario', async() =>{
        const newUser = {
            email: 'test-wrong-role@email.com',
            password: 'test1234',
            name: 'Test Wrong Role',
            role: 'SUPERADMIN',
            isActive: true
        }
        const response = await api
            .post('/api/auth/register')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        expect(response.body.message).toBe('User creation failed');
        expect(response.body.errors[0]).toBe('Invalid role');
    })
    test('Registro fallido por campos incompletos', async() =>{
        const newUser = {
            email: 'test-field-missing@email.com',
            password: 'test1234',
            name: '',
            role: '',
            isActive: true
        }
        const response = await api
            .post('/api/auth/register')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        expect(response.body.message).toBe('User creation failed');
        expect(response.body.errors[0]).toBe('The field \'name\' must be greater than 2 characters');
    })
})

describe('Authentication', () => {
    test('Acceso ADMIN a ruta protegida', async() => {
        const loginResponse = await api
            .post('/api/auth/login')
            .send({
                email: 'test-admin@email.com',
                password: 'admin123'
            });
        const token = loginResponse.body.token;
        const response = await api
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        expect(response.body.length).toBe(3);
    })
    test('Acceso denegado a rol USER a ruta administrativa', async() => {
        const loginResponse = await api
            .post('/api/auth/login')
            .send({
                email: 'test-user@email.com',
                password: 'user123'
            });
        const token = loginResponse.body.token;
        const response = await api
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .expect(403)
            .expect('Content-Type', /application\/json/);
        expect(response.body.message).toBe('You are not authorized to access this resource');
    })
    test('Acceso a ruta protegida con rol USER', async() => {
        const loginResponse = await api
            .post('/api/auth/login')
            .send({
                email: 'test-user@email.com',
                password: 'user123'
            });
        const token = loginResponse.body.token;
        const response = await api
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        expect(response.body.user.email).toBe('test-user@email.com');
        expect(response.body.user.role).toBe('USER');
        expect(response.body.user.name).toBe('Test User');
    })
    test('Acceso denegado a /me con usuario desactivado', async() => {
        const loginResponse = await api
            .post('/api/auth/login')
            .send({
                email: 'test-deactivated@email.com',
                password: 'user123'
            });
        const token = loginResponse.body.token;
        const response = await api
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`)
            .expect(403)
            .expect('Content-Type', /application\/json/);
        expect(response.body.message).toBe('User account is deactivated');
    })
    test('Manipulación de token para cambiar de rol', async () => {
        const users = await userService.getUsersService();
        const token = generateToken({ 
            id: users[1].id,
            email: users[1].email,
            role: "ADMIN", 
            isActive: true
        })
        const response = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .expect(403)
            .expect('Content-Type', /application\/json/);
        expect(response.body.message).toBe('You are not authorized to access this resource');
    })
})