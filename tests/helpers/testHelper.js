const TestDatabase = require('../setup/testDatabase');
const bcrypt = require('bcryptjs');

class TestHelper {
    constructor() {
        this.testDb = null;
        this.prisma = null;
    }

    /**
     * Inicializa el helper para un test
     */
    async setup() {
        this.testDb = new TestDatabase();
        this.prisma = await this.testDb.initialize();
        return this.prisma;
    }

    /**
     * Limpia la base de datos después de cada test
     */
    async cleanup() {
        if (this.testDb) {
            await this.testDb.cleanDatabase();
        }
    }

    /**
     * Cierra las conexiones
     */
    async teardown() {
        if (this.testDb) {
            await this.testDb.close();
        }
    }

    /**
     * Crea datos de prueba para empleados
     */
    async createTestEmployee(data = {}) {
        const defaultData = {
            identification: `TEST${Date.now()}`,
            firstName: 'Juan',
            firstSurname: 'Pérez',
            salary: 1500000,
            transportAllowance: true,
            isActive: true
        };

        return await this.prisma.employee.create({
            data: { ...defaultData, ...data }
        });
    }

    /**
     * Crea datos de prueba para períodos
     */
    async createTestPeriod(data = {}) {
        const defaultData = {
            period: '2024-01',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-01-31'),
            status: 'OPEN'
        };

        return await this.prisma.period.create({
            data: { ...defaultData, ...data }
        });
    }

    /**
     * Crea datos de prueba para novedades
     */
    async createTestNovelty(data = {}) {
        const defaultData = {
            date: new Date(),
            quantity: 1,
            value: 100000,
            status: 'PENDING'
        };

        return await this.prisma.novelty.create({
            data: { ...defaultData, ...data }
        });
    }

    /**
     * Crea datos de prueba para usuarios
     */
    async createTestUser(data = {}) {
        const defaultData = {
            email: `test${Date.now()}@example.com`,
            name: 'Usuario de Prueba',
            password: 'password123',
            role: 'USER',
            isActive: true
        };

        return await this.prisma.user.create({
            data: { ...defaultData, ...data }
        });
    }

    /**
     * Crea múltiples usuarios de prueba para auth
     */
    async createAuthTestUsers() {
        if (!this.prisma) {
            throw new Error('Prisma no está inicializado. Ejecuta setup() primero.');
        }

        const users = [
            {
                email: 'test-admin@email.com',
                name: 'Test Admin',
                password: 'admin123',
                role: 'ADMIN',
                isActive: true
            },
            {
                email: 'test-user@email.com',
                name: 'Test User',
                password: 'user123',
                role: 'USER',
                isActive: true
            },
            {
                email: 'test-deactivated@email.com',
                name: 'Test Deactivated',
                password: 'user123',
                role: 'USER',
                isActive: false
            }
        ];

        const createdUsers = [];
        for (const userData of users) {
            try {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                const user = await this.prisma.user.create({
                    data: {
                        ...userData,
                        password: hashedPassword
                    }
                });
                createdUsers.push(user);
                console.log(`✅ Usuario creado: ${user.email}`);
            } catch (error) {
                console.error(`❌ Error creando usuario ${userData.email}:`, error.message);
                throw error;
            }
        }

        return createdUsers;
    }

    /**
     * Obtiene el cliente Prisma
     */
    getPrisma() {
        return this.prisma;
    }
}

module.exports = TestHelper; 