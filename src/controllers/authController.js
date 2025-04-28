const { getUsersService, registerService, loginService} = require('../services/authService')

exports.users = async(req, res) => {
    try{
        const users = await getUsersService();
        if(!users){
            return res.status(404).json({ error: 'Error fetching data'});
        }
        return res.json(users);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

exports.register = async(req, res) => {
    try {
        const {email,name,password, role} = req.body;
        await registerService(email, name, password, role);
        res.status(201).json({ message: `User: ${name} was created succesfully!`});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

exports.login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const token = await loginService(email, password);
        return res.status(200).json({ message: token });
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}