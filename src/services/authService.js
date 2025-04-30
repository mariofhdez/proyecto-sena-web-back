const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ValidationError } = require('../utils/appError');

exports.registerService = async (email, name, password, role) => {
    const existingUser = await prisma.user.findFirst({ where: {email}});
    if(existingUser){
        throw new ValidationError('Este correo ya está registrado');
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
        throw new ValidationError('Usuario o contraseña inválidas');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        throw new ValidationError('Usuario o contraseña inválidas');
    }

    const token = jwt.sign({ id: user.id, user: user.email, role: user.role, isActive: user.isActive }, process.env.JWT_SECRET, { expiresIn: '4h' });
    return token;
}