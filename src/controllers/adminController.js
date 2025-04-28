const { getUsersService, deactivateUser } = require('../services/adminService')

exports.users = async(req, res) => {
    try{
        if(req.user.role !== 'ADMIN') return res.status(403).json({ error: "Acceso denegado"});
        
        const users = await getUsersService();
        if(!users){
            return res.status(404).json({ error: 'Error consultando datos'});
        }
        return res.json(users);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

exports.deactivateUser = async(req, res) => {
    try{
        if(req.user.role !== 'ADMIN') return res.status(403).json({ error: "Acceso denegado"});

        // const userId = req.params.id;
        // if(!userId || userId.length == 0) return res.status(400).json({ error: 'La petición está incompleta falta el parámetro \'id\' en el path.'});
        
        await deactivateUser(req.params.id);
        
        return res.status(201).json({ message: 'Usuario desactivado correctamente.'});
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
        // return res.status(500).json({ error: 'Error al ejecutar proceso'});
    }
}