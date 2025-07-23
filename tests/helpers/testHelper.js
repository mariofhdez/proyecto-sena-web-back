const TestDatabase = require('../setup/testDatabase');
const bcrypt = require('bcryptjs');
const fs = require('fs');

class TestHelper {
    constructor() {
        this.testDb = null;
        this.prisma = null;
        this.staticDataLoaded = false;
    }

    /**
     * Inicializa el helper para un test
     */
    async setup() {
        this.testDb = new TestDatabase();
        this.prisma = await this.testDb.initialize();
        
        // Cargar datos estáticos solo una vez por sesión de test
        if (!this.staticDataLoaded) {
            await this.loadStaticData();
            this.staticDataLoaded = true;
        }
        
        return this.prisma;
    }

    /**
     * Carga los datos estáticos (conceptos) en la base de datos
     */
    async loadStaticData() {
        try {
            // Cargar datos desde el archivo JSON
            const data = JSON.parse(fs.readFileSync('./prisma/staticData.json', 'utf8'));
            
            // Cargar conceptos usando upsert para evitar duplicados
            for (const concept of data.PayrollConcept) {
                await this.prisma.concept.upsert({
                    where: { code: concept.code },
                    update: concept,
                    create: concept,
                });
            }
            
            console.log('✅ Datos estáticos cargados en BD de test');
        } catch (error) {
            console.error('❌ Error cargando datos estáticos:', error.message);
            throw error;
        }
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
     * Crea datos de prueba para empleados
     */
    async createTestSettlementDetail(data = {}) {
        const defaultData = {
            value: 100000,
            quantity: 1,
            date: new Date(),
            status: 'OPEN'
        };
        
        return await this.prisma.settlementDetail.create({
            data: { ...defaultData, ...data }
        });
    }
    /**
     * Crea datos de prueba para empleados
     */
    async createTestSettlement(data = {}) {
        const defaultData = {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-01-31'),
            status: 'OPEN',
            earningsValue: 0,
            deductionsValue: 0,
            totalValue: 0
        };
        
        return await this.prisma.settlement.create({
            data: { ...defaultData, ...data }
        });
    }
    
    async loadTestNovelties(employeeId, conceptId){
        if (!this.prisma) {
            throw new Error('Prisma no está inicializado. Ejecuta setup() primero.');
        }
        
        const novelties = [
            {
                date: new Date(),
                quantity: 1,
                value: 100000,
                status: 'PENDING',
                employeeId: employeeId,
                conceptId: conceptId,
            }
        ]
        const createdNovelties = [];
        for (const novelty of novelties) {
            const createdNovelty = await this.prisma.novelty.create({ data: novelty });
            createdNovelties.push(createdNovelty);
        }
        return createdNovelties;
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

    async loadTestEmployees() {
        if (!this.prisma) {
            throw new Error('Prisma no está inicializado. Ejecuta setup() primero.');
        }
        
        const employees = [
            {
                identification: '123',
                firstName: 'Jhon',
                firstSurname: 'Doe',
                salary: 2000000,
                transportAllowance: true,
                isActive: true,
                position: 'Tester'
            },
            {
                identification: '456',
                firstName: 'Ana',
                firstSurname: 'García',
                salary: 2000000,
                transportAllowance: false,
                isActive: false,
                position: 'Tester'
            }
        ]
        const createdEmployees = [];
        for (const employee of employees) {
            const createdEmployee = await this.prisma.employee.create({ data: employee });
            createdEmployees.push(createdEmployee);
        }
        return createdEmployees;
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