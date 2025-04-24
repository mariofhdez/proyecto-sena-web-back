const { City } = require ('../models/cityModel');

const create = async (req, res) => {
    try{
        const data = req.body;
        const response = await City.create({ id: data.id, name: data.name });
        res.json({ success: true, data: response});
    } catch (error) {
        res.status(500).send({ success: false, message: error.message})
    }
}

module.exports = { create };