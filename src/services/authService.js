const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient({
    log: ['error'],
});

exports.getUsersService = async () => {
    const users = await prisma.user.findMany();
    return users;
}

exports.registerService = async (email, name, password, role) => {
    try {
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password,
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
        if(password !== user.password) return res.status(400).json({ error: 'Usuario o contraseña invalida'});
        return token = 'Usuario autenticado correctamente.';
    } catch (error) {
        throw new Error('Error al autenticarse');       
    }
}