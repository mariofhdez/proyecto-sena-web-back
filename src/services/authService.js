const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* 
#####   Servicio de Autenticación     #####
Este servicio se encarga de la comunicación con la base de datos.

Importante: para el proyecto y por ende para esta actividad se usa un ORM llamado Prisma
este ORM permite crear el modelado de datos y hacer persistente los datos a través de su configuración.
Para ver el modelo de datos puede ir a ./prisma/schema.prisma

-> registerService es una función que toma los parámetros:
        email: correo del usuario
        name: nombre del usuario
        password: contraseña
        role: el perfil del usuario
    A partir de esta información valida inicialmente en la BD que el correo electrónico no sea un valor repetido
    Si es un valor repetido lanza un error indicando que el correo ya está registrado
    Si no es un valor repetido ejecuta dos procesos:
    encripta la contraseña bajo un algoritmo hash
    luego, registra la información en la base de datos
    se retorna el usuario creado al final de la función
*/

exports.registerService = async (email, name, password, role) => {
    const existingUser = await prisma.user.findFirst({ where: {email}});
    if(existingUser){
        const error = new Error('Este correo ya está registrado');
        error.name = 'Correo duplicado';
        error.code = 'AU001';
        throw error;
    }

/*
-> loginService es una función que toma los parámetros:
        email: correo del usuario
        password: constrseña del usuario
    Primero realiza una consulta a la BD a partir del correo
    si no encuentra el correo lanza un error genérico
    si lo encuentra sigue con el flujo
    valida la contraseña, como es un valor encriptado se usa una función de la librería bcrypt para comparar valores
    si la contraseña es incorrecta lanza el error genérico
    si la contraseña es correcta continua con el flujo
    por último se firma un token cumpliendo con las mejores prácticas de la industria y se retorna en la respuesta
*/

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            role,
            isActive: true
        },
        select: {
            email: true,
            name: true
        }
    });
    return newUser;

}

exports.loginService = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
        const error = new Error('Usuario o contraseña inválidas');
        error.name = 'Credenciales incorrectas';
        error.code = 'AU002';
        throw error;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        const error = new Error('Usuario o contraseña inválidas');
        error.name = 'Credenciales incorrectas';
        error.code = 'AU002';
        throw error;
    }

    const token = jwt.sign({ id: user.id, user: user.email, role: user.role, isActive: user.isActive }, process.env.JWT_SECRET, { expiresIn: '4h' });
    return token;
}