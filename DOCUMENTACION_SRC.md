# Documentación del Proyecto SENA Backend

## Estructura del Proyecto

Este proyecto es una API REST para gestión de nómina desarrollada en Node.js con Express y Prisma ORM.

## Archivos Principales

### 1. `server.js`
**Ubicación:** `src/server.js`
**Descripción:** Punto de entrada principal del servidor
**Funcionalidad:**
- Carga las variables de entorno desde `.env`
- Inicializa la aplicación Express
- Carga los conceptos de nómina al inicio
- Inicia el servidor en el puerto especificado (default: 3005)
- Maneja errores de inicio del servidor

**Dependencias:**
- `dotenv` - Para variables de entorno
- `./app` - Aplicación Express configurada
- `./config/payrollConcepts` - Configuración de conceptos de nómina

### 2. `app.js`
**Ubicación:** `src/app.js`
**Descripción:** Configuración principal de la aplicación Express
**Funcionalidad:**
- Configura middlewares esenciales (JSON, CORS, logging)
- Monta las rutas de la API bajo el prefijo `/api`
- Maneja rutas no encontradas (404)
- Configura el middleware global de manejo de errores

**Middlewares configurados:**
- `express.json()` - Procesamiento de JSON
- `loggerMiddleware` - Logging de peticiones
- `cors()` - Habilitación de CORS
- `errorHandler` - Manejo global de errores

## Configuración

### 3. `payrollConcepts.js`
**Ubicación:** `src/config/payrollConcepts.js`
**Descripción:** Gestión de conceptos de nómina
**Funcionalidad:**
- Carga conceptos de nómina desde la base de datos
- Filtra conceptos por tipo (ingresos, vacaciones, IBC)
- Proporciona funciones de consulta para conceptos
- Mantiene conceptos regulares predefinidos

**Funciones principales:**
- `loadPayrollConcepts()` - Carga conceptos desde DB
- `getPayrollConceptById(id)` - Obtiene concepto por ID
- `getAllPayrollConcepts()` - Lista todos los conceptos
- `getBaseType(id)` - Obtiene tipo de base de un concepto
- `getCalculationType(id)` - Obtiene tipo de cálculo
- `getConceptFactor(id)` - Obtiene factor del concepto
- `getConceptByCode(code)` - Busca concepto por código
- `getRegularConcepts(code)` - Verifica si es concepto regular

## Middlewares

### 4. `auth.js`
**Ubicación:** `src/middlewares/auth.js`
**Descripción:** Middleware de autenticación JWT
**Funcionalidad:**
- Autentica tokens JWT en las solicitudes
- Genera tokens JWT para usuarios
- Valida cabeceras de autorización
- Maneja errores de autenticación

**Funciones:**
- `authenticateToken(req, res, next)` - Valida token JWT
- `generateToken(user)` - Genera token JWT para usuario

### 5. `errorHandler.js`
**Ubicación:** `src/middlewares/errorHandler.js`
**Descripción:** Middleware para manejo centralizado de errores
**Funcionalidad:**
- Captura todos los errores de la aplicación
- Registra errores en consola con timestamp
- Envía respuestas JSON estructuradas
- Maneja diferentes tipos de errores

### 6. `logger.js`
**Ubicación:** `src/middlewares/logger.js`
**Descripción:** Middleware para logging de peticiones HTTP
**Funcionalidad:**
- Registra información de peticiones entrantes
- Mide tiempo de respuesta
- Registra método HTTP, URL e IP
- Proporciona logs con timestamp

## Utilidades

### 7. `appError.js`
**Ubicación:** `src/utils/appError.js`
**Descripción:** Clases de error personalizadas
**Clases definidas:**
- `AppError` - Clase base para errores de aplicación
- `NotFoundError` - Error 404 (recurso no encontrado)
- `ValidationError` - Error 400 (datos inválidos)
- `UnauthorizedError` - Error 401 (no autorizado)
- `ForbiddenError` - Error 403 (acceso no permitido)

### 8. `formatDate.js`
**Ubicación:** `src/utils/formatDate.js`
**Descripción:** Utilidad para formateo de fechas
**Funcionalidad:**
- Convierte strings de fecha a formato ISO
- Maneja valores nulos o vacíos

### 9. `verifyId.js`
**Ubicación:** `src/utils/verifyId.js`
**Descripción:** Utilidad para verificar existencia de IDs
**Funcionalidad:**
- Verifica si un ID existe en un modelo específico
- Utiliza Prisma para consultas a la base de datos

### 10. `typeofValidations.js`
**Ubicación:** `src/utils/typeofValidations.js`
**Descripción:** Validaciones de tipos de datos
**Funcionalidad:**
- Proporciona funciones para validar tipos de datos
- Incluye validaciones para strings, números, booleanos, etc.

### 11. `userValidation.js`
**Ubicación:** `src/utils/userValidation.js`
**Descripción:** Validaciones específicas para usuarios
**Funcionalidad:**
- Valida datos de registro de usuarios
- Valida credenciales de login
- Verifica formatos de email y contraseña

### 12. `employeeValidation.js`
**Ubicación:** `src/utils/employeeValidation.js`
**Descripción:** Validaciones específicas para empleados
**Funcionalidad:**
- Valida datos de empleados
- Verifica campos requeridos
- Valida formatos de datos

### 13. `periodValidation.js`
**Ubicación:** `src/utils/periodValidation.js`
**Descripción:** Validaciones para períodos de nómina
**Funcionalidad:**
- Valida fechas de períodos
- Verifica solapamiento de períodos
- Valida formatos de fechas

### 14. `settlementValidation.js`
**Ubicación:** `src/utils/settlementValidation.js`
**Descripción:** Validaciones para liquidaciones
**Funcionalidad:**
- Valida datos de liquidaciones
- Verifica cálculos de nómina
- Valida conceptos aplicados

### 15. `settlementNewValidation.js`
**Ubicación:** `src/utils/settlementNewValidation.js`
**Descripción:** Validaciones para nueva versión de liquidaciones
**Funcionalidad:**
- Validaciones avanzadas para liquidaciones
- Verificación de cálculos complejos
- Validación de múltiples conceptos

## Rutas

### 16. `index.js` (Rutas)
**Ubicación:** `src/routes/index.js`
**Descripción:** Configuración central de rutas
**Rutas configuradas:**
- `/auth` - Autenticación
- `/admin` - Funciones administrativas
- `/user` - Gestión de usuarios
- `/employee` - Gestión de empleados
- `/settlement-news` - Nueva versión de liquidaciones
- `/settlement` - Liquidaciones tradicionales
- `/period` - Gestión de períodos
- `/concept` - Gestión de conceptos

### 17. `auth.js` (Rutas)
**Ubicación:** `src/routes/auth.js`
**Descripción:** Rutas de autenticación
**Endpoints:**
- `POST /register` - Registro de usuarios
- `POST /login` - Inicio de sesión

### 18. `admin.js` (Rutas)
**Ubicación:** `src/routes/admin.js`
**Descripción:** Rutas administrativas
**Funcionalidad:**
- Gestión de usuarios del sistema
- Configuraciones administrativas
- Reportes y estadísticas

### 19. `user.js` (Rutas)
**Ubicación:** `src/routes/user.js`
**Descripción:** Rutas de gestión de usuarios
**Funcionalidad:**
- Perfil de usuario
- Cambio de contraseña
- Actualización de datos

### 20. `employee.js` (Rutas)
**Ubicación:** `src/routes/employee.js`
**Descripción:** Rutas de gestión de empleados
**Funcionalidad:**
- CRUD de empleados
- Búsqueda y filtrado
- Gestión de información laboral

### 21. `settlementNew.js` (Rutas)
**Ubicación:** `src/routes/settlementNew.js`
**Descripción:** Rutas para nueva versión de liquidaciones
**Funcionalidad:**
- Liquidaciones mejoradas
- Cálculos avanzados
- Gestión de conceptos complejos

### 22. `settlement.js` (Rutas)
**Ubicación:** `src/routes/settlement.js`
**Descripción:** Rutas de liquidaciones tradicionales
**Funcionalidad:**
- Liquidaciones básicas
- Cálculos estándar

### 23. `period.js` (Rutas)
**Ubicación:** `src/routes/period.js`
**Descripción:** Rutas de gestión de períodos
**Funcionalidad:**
- CRUD de períodos de nómina
- Validación de fechas
- Gestión de períodos activos

### 24. `concept.js` (Rutas)
**Ubicación:** `src/routes/concept.js`
**Descripción:** Rutas de gestión de conceptos
**Funcionalidad:**
- Consulta de conceptos de nómina
- Información de conceptos

## Controladores

### 25. `authController.js`
**Ubicación:** `src/controllers/authController.js`
**Descripción:** Controlador de autenticación
**Funciones:**
- `register(req, res, next)` - Registro de usuarios
- `login(req, res, next)` - Autenticación de usuarios

### 26. `adminController.js`
**Ubicación:** `src/controllers/adminController.js`
**Descripción:** Controlador de funciones administrativas
**Funcionalidad:**
- Gestión de usuarios del sistema
- Configuraciones administrativas
- Reportes y estadísticas

### 27. `userController.js`
**Ubicación:** `src/controllers/userController.js`
**Descripción:** Controlador de gestión de usuarios
**Funcionalidad:**
- Perfil de usuario
- Actualización de datos
- Gestión de preferencias

### 28. `employeeController.js`
**Ubicación:** `src/controllers/employeeController.js`
**Descripción:** Controlador de gestión de empleados
**Funcionalidad:**
- CRUD completo de empleados
- Búsqueda y filtrado
- Gestión de información laboral
- Validaciones de datos

### 29. `settlementController.js`
**Ubicación:** `src/controllers/settlementController.js`
**Descripción:** Controlador de liquidaciones tradicionales
**Funcionalidad:**
- Liquidaciones básicas
- Cálculos estándar de nómina
- Gestión de conceptos básicos

### 30. `settlementNewController.js`
**Ubicación:** `src/controllers/settlementNewController.js`
**Descripción:** Controlador de nueva versión de liquidaciones
**Funcionalidad:**
- Liquidaciones mejoradas
- Cálculos avanzados
- Gestión de conceptos complejos
- Validaciones avanzadas

### 31. `settlementDeductionController.js`
**Ubicación:** `src/controllers/settlementDeductionController.js`
**Descripción:** Controlador de deducciones de liquidación
**Funcionalidad:**
- Gestión de deducciones
- Cálculos de descuentos
- Aplicación de conceptos de deducción

### 32. `settlementEarningController.js`
**Ubicación:** `src/controllers/settlementEarningController.js`
**Descripción:** Controlador de ganancias de liquidación
**Funcionalidad:**
- Gestión de ganancias
- Cálculos de ingresos
- Aplicación de conceptos de ganancia

### 33. `periodController.js`
**Ubicación:** `src/controllers/periodController.js`
**Descripción:** Controlador de gestión de períodos
**Funcionalidad:**
- CRUD de períodos de nómina
- Validación de fechas
- Gestión de períodos activos
- Control de solapamientos

### 34. `conceptController.js`
**Ubicación:** `src/controllers/conceptController.js`
**Descripción:** Controlador de conceptos de nómina
**Funcionalidad:**
- Consulta de conceptos
- Información de conceptos disponibles

### 35. `payrollController.js`
**Ubicación:** `src/controllers/payrollController.js`
**Descripción:** Controlador principal de nómina
**Funcionalidad:**
- Cálculos completos de nómina
- Gestión de conceptos
- Procesamiento de liquidaciones
- Reportes de nómina

## Servicios

### 36. `authService.js`
**Ubicación:** `src/services/authService.js`
**Descripción:** Servicio de autenticación
**Funcionalidad:**
- Lógica de negocio para autenticación
- Validación de credenciales
- Generación de tokens
- Encriptación de contraseñas

### 37. `adminService.js`
**Ubicación:** `src/services/adminService.js`
**Descripción:** Servicio de funciones administrativas
**Funcionalidad:**
- Lógica de negocio administrativa
- Gestión de usuarios del sistema
- Configuraciones del sistema

### 38. `userService.js`
**Ubicación:** `src/services/userService.js`
**Descripción:** Servicio de gestión de usuarios
**Funcionalidad:**
- Lógica de negocio para usuarios
- Gestión de perfiles
- Actualización de datos

### 39. `employeeService.js`
**Ubicación:** `src/services/employeeService.js`
**Descripción:** Servicio de gestión de empleados
**Funcionalidad:**
- Lógica de negocio para empleados
- Operaciones CRUD
- Validaciones de negocio
- Búsquedas y filtros

### 40. `settlementService.js`
**Ubicación:** `src/services/settlementService.js`
**Descripción:** Servicio de liquidaciones tradicionales
**Funcionalidad:**
- Lógica de negocio para liquidaciones
- Cálculos básicos de nómina
- Gestión de conceptos básicos

### 41. `settlementNewService.js`
**Ubicación:** `src/services/settlementNewService.js`
**Descripción:** Servicio de nueva versión de liquidaciones
**Funcionalidad:**
- Lógica de negocio avanzada para liquidaciones
- Cálculos complejos de nómina
- Gestión de conceptos avanzados
- Validaciones complejas

### 42. `settlementDeductionService.js`
**Ubicación:** `src/services/settlementDeductionService.js`
**Descripción:** Servicio de deducciones
**Funcionalidad:**
- Lógica de negocio para deducciones
- Cálculos de descuentos
- Aplicación de conceptos de deducción

### 43. `settlementEarningService.js`
**Ubicación:** `src/services/settlementEarningService.js`
**Descripción:** Servicio de ganancias
**Funcionalidad:**
- Lógica de negocio para ganancias
- Cálculos de ingresos
- Aplicación de conceptos de ganancia

### 44. `periodService.js`
**Ubicación:** `src/services/periodService.js`
**Descripción:** Servicio de gestión de períodos
**Funcionalidad:**
- Lógica de negocio para períodos
- Validaciones de fechas
- Control de períodos activos
- Gestión de solapamientos

### 45. `conceptService.js`
**Ubicación:** `src/services/conceptService.js`
**Descripción:** Servicio de conceptos de nómina
**Funcionalidad:**
- Lógica de negocio para conceptos
- Consultas de conceptos
- Gestión de información de conceptos

## Tests

### 46. `tests/` (Directorio)
**Ubicación:** `src/tests/`
**Descripción:** Directorio para pruebas unitarias y de integración
**Estado:** Vacío - Pendiente de implementación de pruebas

## Resumen de Arquitectura

Este proyecto sigue una arquitectura en capas:

1. **Capa de Presentación:** Rutas (`routes/`)
2. **Capa de Control:** Controladores (`controllers/`)
3. **Capa de Negocio:** Servicios (`services/`)
4. **Capa de Datos:** Prisma ORM (configurado externamente)
5. **Utilidades:** Funciones auxiliares (`utils/`)
6. **Configuración:** Archivos de configuración (`config/`)
7. **Middlewares:** Funciones intermedias (`middlewares/`)

## Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Prisma** - ORM para base de datos
- **JWT** - Autenticación por tokens
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Variables de entorno

## Patrones de Diseño

- **MVC (Model-View-Controller)** - Separación de responsabilidades
- **Repository Pattern** - Acceso a datos a través de Prisma
- **Service Layer** - Lógica de negocio separada
- **Middleware Pattern** - Funciones intermedias reutilizables
- **Error Handling** - Manejo centralizado de errores 