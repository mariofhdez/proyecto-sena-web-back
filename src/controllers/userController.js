const userService = require ('../services/userService');

exports.updateUser = async (req, res) => {
    try{
        const userId = req.user.id;
        await userService.updateUser(userId, req.body);
        return res.status(200).json({ message: 'Usuario actualizado con éxito!' });
    } catch(error){
        console.log(error);
        return res.status(500).json({code: "500", error: error.message});
    }
}