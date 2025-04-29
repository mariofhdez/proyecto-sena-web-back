const { registerService, loginService } = require('../services/authService')

exports.register = async(req, res) => {
    try {
        const {email,name,password, role} = req.body;
        await registerService(email, name, password, role);
        res.status(201).json({ message: `User: ${name} was created succesfully!`});
    } catch (error) {
        if(error.code === 'AU001'){
            return res.status(400).json({ code: error.code, error: error.message})
        }

        return res.status(500).json({code: "500", error: error.message});
    }
}

exports.login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const token = await loginService(email, password);
        return res.status(200).json({ message: token });
    } catch (error) {
        if(error.code === 'AU002'){
            return res.status(400).json({ code: error.code, error: error.message})
        }

        return res.status(500).json({code: "500", error: error.message});
    }
}