const { getUsersService } = require('../services/adminService')

exports.users = async(req, res) => {
    try{
        if(req.user.role !== 'ADMIN') return res.status(403).json({ error: "Unauthorized"});
        
        const users = await getUsersService();
        if(!users){
            return res.status(404).json({ error: 'Error fetching data'});
        }
        return res.json(users);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}