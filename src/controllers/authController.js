const { registerService, loginService } = require('../services/authService')

/*
#####     Controlador Autenticación     #####
En este fichero se administran las peticiones http, se administra la lógica del servicio 
y se gestionan las respuestas entregadas a los usuarios
*/


/**
 * -> register: es una función que recibre dos parámetros:
 *      req: corresponde a la petición del usuario
 *      res: corresponde a la respuesta que se dará al usuario
 *  En principio lo que hace esta función es descomponer las peticiones de los usuarios en los elementos
 *  requeridos para el procesamiento del registro.
 *  Hace llamados al servicio para registro en BD.
 *  Dependiendo del resultado del proceso responde de forma positiva o retorna un error.
 */
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

/**
 * -> login: es una función que recibre dos parámetros:
 *      req: corresponde a la petición del usuario
 *      res: corresponde a la respuesta que se dará al usuario
 *  Como la anterior función su tarea es descomponer las peticiones de los usuarios en los elementos
 *  requeridos para el procesamiento del inicio de sesión.
 *  Hace llamados al servicio para validar los datos ante lo registrdo en BD.
 *  Dependiendo del resultado del proceso responde de forma positiva o retorna un error.
 */

exports.login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const token = await loginService(email, password);
        return res.status(200).json({ message: "Usuario autenticado correctamente", token: token });
    } catch (error) {
        if(error.code === 'AU002'){
            return res.status(400).json({ code: error.code, error: error.message})
        }

        return res.status(500).json({code: "500", error: error.message});
    }
}