# Testing con Base de Datos Separada

Configuración simple y estable para testing con base de datos separada.

## 🚀 Configuración Rápida

### 1. Configurar Variables de Entorno

Crea un archivo `.env` con:

```env
# Base de datos principal
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/nomina_db"

# Base de datos para testing (separada)
TEST_DATABASE_URL="mysql://usuario:contraseña@localhost:3306/nomina_test"
```

### 2. Configurar Base de Datos de Test

```bash
npm run test:db:setup
```

## 🧪 Ejecutar Tests

### Tests Básicos
```bash
npm test
```

### Tests en Modo Watch
```bash
npm run test:watch
```

### Tests con Coverage
```bash
npm run test:coverage
```

### Limpiar Base de Datos de Test
```bash
npm run test:db:clean
```

## 📁 Estructura de Tests

```
tests/
├── setup/
│   ├── testDatabase.js          # Clase para manejar BD de test
│   ├── globalSetup.js           # Setup global de Jest
│   ├── jest.setup.js            # Setup por archivo de test
│   └── cleanDb.js               # Script para limpiar BD
├── helpers/
│   └── testHelper.js            # Helper para crear datos de prueba
├── unit/                        # Tests unitarios
├── integration/                 # Tests de integración
└── README.md                    # Esta documentación
```

## 🔧 Escribir Tests

### Ejemplo Básico

```javascript
const settlementCalculationEngine = require('../../src/services/settlementCalculationEngine');

describe('SettlementCalculationEngine', () => {
    
    it('should calculate concept value correctly', async () => {
        // Crear datos de prueba usando el helper
        const employee = await global.testHelper.createTestEmployee({
            salary: 1500000
        });
        
        const concept = await global.testHelper.createTestConcept({
            calculationType: 'LINEAL',
            base: 'SALARY',
            divisor: 30
        });
        
        // Ejecutar test
        const result = await settlementCalculationEngine.calculateConceptValue(
            concept.id, 
            employee.id, 
            2, 
            '2024-01-31'
        );
        
        // Assertions
        expect(result).toBe(100000);
    });
});
```

### Helpers Disponibles

El `global.testHelper` proporciona métodos para crear datos de prueba:

- `createTestEmployee(data)` - Crear empleado de prueba
- `createTestConcept(data)` - Crear concepto de prueba
- `createTestPeriod(data)` - Crear período de prueba
- `createTestNovelty(data)` - Crear novedad de prueba
- `createTestUser(data)` - Crear usuario de prueba
- `getPrisma()` - Obtener cliente Prisma

## 🛡️ Seguridad

### Verificaciones Automáticas

- Los tests solo se ejecutan con `NODE_ENV=test`
- Se verifica que `TEST_DATABASE_URL` esté configurada
- La base de datos de test se limpia automáticamente después de cada test
- No se puede acceder a la base de datos de producción desde tests

### Buenas Prácticas

1. **Nunca usar la base de datos de producción para tests**
2. **Siempre limpiar datos después de cada test**
3. **Usar datos de prueba específicos para cada test**
4. **No depender de datos existentes en la base de datos**

## 🔍 Troubleshooting

### Error: "TEST_DATABASE_URL no está configurada"
- Verifica que el archivo `.env` tenga la variable `TEST_DATABASE_URL`
- Asegúrate de que la URL apunte a una base de datos diferente a la de producción

### Error: "TestDatabase solo debe usarse en entorno de test"
- Ejecuta los tests con `NODE_ENV=test`
- Usa los scripts npm: `npm test`, `npm run test:watch`

### Error de conexión a la base de datos
- Verifica que MySQL esté ejecutándose
- Confirma que las credenciales en `TEST_DATABASE_URL` sean correctas
- Ejecuta `npm run test:db:setup` para configurar la base de datos

### Tests lentos
- Los tests pueden ser lentos la primera vez debido a las migraciones
- Usa `npm run test:watch` para ejecutar solo tests modificados
- Considera usar `npm run test:coverage` para ver qué código está siendo testeado

## 📊 Monitoreo

### Coverage Report
```bash
npm run test:coverage
```

Esto generará un reporte de cobertura en `coverage/` que puedes abrir en el navegador.

### Logs de Test
Los tests muestran logs informativos:
- 🚀 Setup iniciado
- 📦 Migraciones ejecutadas
- 🔧 Cliente Prisma generado
- 🧹 Limpieza completada
- ✅ Tests exitosos

## 🔄 Flujo de Desarrollo

1. **Desarrollo**: Trabaja en tu código
2. **Test**: Ejecuta `npm test` para verificar cambios
3. **Debug**: Usa `npm run test:watch` para desarrollo iterativo
4. **Coverage**: Ejecuta `npm run test:coverage` antes de commit
5. **Clean**: Usa `npm run test:db:clean` si necesitas resetear la BD de test 