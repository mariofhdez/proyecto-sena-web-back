const { getUsers, getUser, deactivateUser, deleteUser } = require('../services/adminService')

exports.users = async(req, res) => {
    try{
        if(req.user.role !== 'ADMIN') return res.status(403).json({ error: "Acceso denegado"});
        
        const users = await getUsers();
        if(!users){
            return res.status(404).json({ code: "AD404", error: 'Error consultando datos'});
        }
        return res.json(users);
    } catch (error) {
        return res.status(500).json({code: "500", error: error.message});
    }
}

exports.getUser = async(req, res) => {
    try{
        if(req.user.role !== 'ADMIN') return res.status(403).json({ error: "Acceso denegado"});
        
        const users = await getUser(req.params.id);
        if(!users){
            return res.status(404).json({ code: "AD404", error: 'Error consultando datos'});
        }
        return res.json(users);
    } catch (error) {
        return res.status(500).json({code: "500", error: error.message});
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
        return res.status(500).json({code: "500", error: error.message});
    }
}

exports.deleteUser = async (req, res) => {
    try{
        if(req.user.role !== 'ADMIN') return res.status(403).json({ error: "Acceso denegado"});

        await deleteUser(req.params.id);

        return res.status(201).json({ message: 'Usuario eliminado con éxito!'});
    } catch (error){
        console.log(error);
        return res.status(500).json({code: "500", error: error.message});
    }
}