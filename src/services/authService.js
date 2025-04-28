const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerService = async (email, name, password, role) => {
    try {
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
    } catch (error) {
        if(error.code === "P2002"){
            throw new Error('Este correo ya está resgistrado');
        }
        throw new Error('Error al crear usuario.');
    }
}

exports.loginService = async (email, password) => {
    try {
        const user = await prisma.user.findUnique({ where: { email: email }});
        if(!user) return res.status(400).json({ error: 'Usuario o contraseña invalida'});

        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) return res.status(400).json({ error: 'Usuario o contraseña invalida'});

        const token = jwt.sign({ id: user.id, user: user.email, role: user.role, isActive: user.isActive}, process.env.JWT_SECRET, {expiresIn: '4h'});
        return token;
    } catch (error) {
        throw new Error(error);
        // throw new Error('Error al autenticarse');
    }
}