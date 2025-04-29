const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerService = async (email, name, password, role) => {
    const existingUser = await prisma.user.findFirst({ where: {email}});
    if(existingUser){
        const error = new Error('Este correo ya está registrado');
        error.name = 'Correo duplicado';
        error.code = 'AU001';
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            role,
            isActive: 'TRUE'
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