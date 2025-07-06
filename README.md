# API REST - PAYMA: Sistema de Gestión de Nómina

Una API RESTful para gestionar el cálculo de los pagos a empleados, que permite realizar operaciones CRUD completas sobre Liquidación de Nóminas, Novedades, Empleados y Usuarios.

---

## 🚀 Descripción General

Esta API proporciona endpoints para crear, leer, actualizar y eliminar recursos. Además, incluye autenticación, documentación y próximamente estará incluyendo pruebas automatizadas.

📺 [Introducción a PAYMA: sistema de gestión de nómina](https://www.loom.com/share/8abac3eebd914fd1a2335e0a08a52862?sid=c54fabd5-42bb-4e09-87ab-4e4e7d2384a2)
▶️ [Demostración del sistema y sus funcionalidades](https://www.loom.com/share/1636e23cd48e4ca0b5c64db31a347d50?sid=f1636c21-1b75-46a3-9b74-50282d5532be)

---

## 📋 Requisitos

- Requiere **Node.js** >= 22 (LTS) puede obtenerse fácilmente desde la página oficial https://nodejs.org/en
- Requiere el gestor de paquetes **NPM** que también puede ser obtenido desde la página oficial de Node.
- Requiere Base de Datos **MariaDB** >= 10.2 o **MySQL** >= 5.7
- El uso de Apache **XAMPP** es opcional.

---

## 🛠️ Instalación

Aquí puedes ver la ejecución de estos pasos en [video](https://www.loom.com/share/2398a8873b3b4771a36fe52f298513c9?sid=6bc760f1-853e-4e55-9de0-9701cb4d1755)

1. Clona el repositorio:
   ```
   git clone https://github.com/mariofhdez/proyecto-sena-web-back.git
   cd proyecto-sena-web-back
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Configura las variables de entorno:

   Crea un archivo .env
   ```
   // En Windows
   echo > .env
   // En Linux o Mac
   touch .env
   ```

   Luego, basado en .env-example se deben agregar las variables necesarias para configurar el servidor:
   ```
   // Configuración del servidor
   PORT=3000                # Puerto en el que se ejecutará la aplicación
   NODE_ENV=development     # Entorno de ejecución (development, production, test)   
   ```

   También las credenciales de conexión a la Base de Datos:
   ```
   // Configuración de la base de datos MySQL
   DB_USER='usuario_db'     # Usuario de la base de datos
   DB_PASSWORD='contraseña' # Contraseña de la base de datos
   DB_HOST='localhost'      # Host de la base de datos
   DB_NAME='nombre_db'      # Nombre de la base de datos
   DB_PORT='3306'           # Puerto de la base de datos MySQL

   DATABASE_URL="mysql://usuario_db:contraseña@localhost:3306/nombre_db"  # Se compone de los elementos previos
   ```

   Por último, solo es necesario configurar una clave secreta para la firma del JWT:
   ```
   // Configuración de seguridad
   JWT_SECRET='tu_clave_secreta_jwt' # Clave secreta para firmar los tokens JWT ej. '$3n@'
   ```
   
   
5. Ejecuta los scripts de configuración:
   Desde la línea de comandos ejecuta la siguiente instrucción para crear la base de datos.
   ```
   npx prisma migrate dev --name init
   npx prisma generate
   ```
   Para cargar las constantes ejecuta la instrucción
   ```
   npm run seed:static
   ```

6. Inicia el servidor en desarrollo:
   ```  
   npm run dev
   ```
---

## 📡 Endpoints Principales

Existen endpoints transversales a la API como lo son:
- servicios de autenticación `/auth`
- servicios de administrador del sistema `/admin`
- servicios de usuario `/user`

Luego están los endpoints correspondientes a la lógica del negocio:
- Gestión de empleados CRUD `/employee`
- Gestión de novedades de nómina CRUD `/settlement-news`
- Gestión de nóminas CRUD `/settlement`
- Gestión de períodos de liquidación CRUD `/period`

Por último están los servicios de configuración del sistema:
- Gestión de conceptos de nómina `/concept`

---

## 🔐 Autenticación

### 1. **Registro en la API**

Es importante que para que el usuario pueda interactuar con los servicios protegidos, debe existir previamente un registro en donde el usuario indique información general:

```
{
   email: john_doe@mail.com,
   name: john doe,
   password: ********,
   role: ADMIN || USER
}
```


### 2. **Generación del Token JWT**
Cuando un usuario se autentica exitosamente (probablemente a través del endpoint de login), el sistema genera un token JWT usando la función `generateToken()`:

```
// El token contiene la información del usuario
{
    id: user.id,
    email: user.email, 
    role: user.role,
    isActive: user.isActive
}
```

**Características del token:**
- **Algoritmo**: HS256
- **Duración**: 4 horas
- **Secreto**: Usa `process.env.JWT_SECRET`

### 3. **Autenticación en Solicitudes**
Para acceder a endpoints protegidos, el cliente debe incluir el token en la cabecera `Authorization`:

```
Authorization: Bearer <token_jwt>
```

### 4. **Validación del Token**
El middleware `authenticateToken()` realiza las siguientes validaciones:

1. **Verifica la presencia de la cabecera**: Si no existe `Authorization`, lanza `UnauthorizedError`
2. **Extrae el token**: Separa el token del prefijo "Bearer "
3. **Valida el token**: Usa `jwt.verify()` para verificar la firma y validez
4. **Asigna el usuario**: Si es válido, asigna la información del usuario a `req.user`
5. **Manejo de errores**: Si el token es inválido, lanza `ForbiddenError`

### 5. **Flujo de Autenticación Completo**

```
Cliente → Login → Servidor genera JWT → Cliente almacena token
Cliente → Solicitud con token → Middleware valida → Acceso permitido/denegado
```

### 6. **Información del Usuario Disponible**
Una vez autenticado, el middleware hace disponible la información del usuario en `req.user`:
- `id`: ID único del usuario
- `email`: Correo electrónico
- `role`: Rol en el sistema (para autorización)
- `isActive`: Estado de activación

### 7. **Manejo de Errores**
- **401 Unauthorized**: Cuando falta la cabecera Authorization
- **403 Forbidden**: Cuando el token es inválido o ha expirado

Este sistema proporciona una autenticación robusta basada en JWT que permite mantener sesiones sin estado y escalar horizontalmente, mientras que la información del rol permite implementar autorización basada en roles en los controladores.

---

## 📄 Documentación

- Documentación técnica de los Endpoints: `http://localhost:${PORT}/api-docs`
- Documentación técnica del código fuente: docs/index.html

---

## ✅ Pruebas

🏗️ en proceso de elaboración

🧪 [Configuración de Postman 🚀 para pruebas de la API](https://www.loom.com/share/bb755f19685f4aeb99ae2a9b9bf5a81b?sid=59dd5733-1db7-4057-b83a-b9f9a27e121d)

---

## ©️ Licencia

Este proyecto está protegido bajo la licencia MIT.

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Abre un issue o envía un pull request para mejorar esta API.

## 📬 Contacto

Autor: Mario Flórez
GitHub: https://github.com/mariofhdez
Linkedin: https://www.linkedin.com/in/mariofhdez
