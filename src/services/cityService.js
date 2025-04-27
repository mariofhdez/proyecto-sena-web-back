const cityModel = require('../models/cityModel');

const sCreateCity = async (data) => {
    console.log('service');
    return res = await cityModel.create(data);
}

const _delete = async (id) => {
    const city = await cityModel.findByPk(id);
    if(!city) return null;
    return await city.destroy();
}


module.exports = { sCreateCity, _delete };