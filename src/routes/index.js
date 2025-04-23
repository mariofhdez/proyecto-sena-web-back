const express = require('express');

const employeesRouter = require ('./employee_router');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/employees', employeesRouter);
}

module.exports = routerApi;