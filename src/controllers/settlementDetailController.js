const settlementDetailService = require("../services/settlementDetailService");
const { NotFoundError } = require("../utils/appError");
const { ValidationError } = require("../utils/appError");
const { formatDate } = require("../utils/formatDate");
const { isValidNumericType } = require("../utils/typeofValidations");
const { verifyId } = require("../utils/verifyId");

exports.retrieveSettlementDetails = async(req, res, next) => {
    try {
        const query = req.query;
        if(Object.keys(query).length > 0){
            const settlementDetails = await settlementDetailService.getAllSettlementDetails(query);
            res.json(settlementDetails);
        } else {
            const settlementDetails = await settlementDetailService.getAllSettlementDetails();
            res.json(settlementDetails);
        }
    } catch (error) {
        next(error)
    }
}
exports.getSettlementDetailById = async(req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if(!isValidNumericType(id)) throw new ValidationError('The field id must be a numeric value.');

        const settlementDetail = await settlementDetailService.getById(id);
        res.json(settlementDetail);
    } catch (error) {
        next(error)
    }
}
exports.createSettlementDetail = async(req, res, next) => {
    try {
        let data = {
            settlement: {connect: {id: null}},
            concept: {connect: {id: null}},
            employee: {connect: {id: null}},
        };
        data.settlement.connect.id = parseInt(req.body.settlementId, 10);
        data.concept.connect.id = parseInt(req.body.conceptId, 10);
        data.employee.connect.id = parseInt(req.body.employeeId, 10);

        data.date = formatDate(req.body.date);
        data.quantity = parseInt(req.body.quantity, 10);
        data.value = parseFloat(req.body.value);

        if(req.body.quantity === 0) throw new ValidationError('SettlementDetail was not created', 'The quantity cannot be 0');

        data.status = 'DRAFT';

        const settlementDetail = await settlementDetailService.create(data);
        res.status(201).json(settlementDetail);
    } catch (error) {
        next(error)
    }
}
exports.updateSettlementDetail = async(req, res, next) => {
    try {
        
    } catch (error) {
        next(error)
    }
}
exports.deleteSettlementDetail = async(req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if(!isValidNumericType(id)) throw new ValidationError('The field id must be a numeric value.');

        const verified = await verifyId(id, 'settlementDetail');
        if(!verified) throw new NotFoundError('Settlement detail with id \'' + id + '\' was not found');

        const settlementDetail = await settlementDetailService.deleteSettlementDetail(id);
        res.json(settlementDetail);
    } catch (error) {
        next(error)
    }
}
exports.getSettlementDetailsBySettlement = async(req, res, next) => {
    try {
        const settlementId = parseInt(req.params.settlementId);
        if(!isValidNumericType(settlementId)) throw new ValidationError('The field settlementId must be a numeric value.');

        const settlementDetails = await settlementDetailService.getAllSettlementDetails({where: {settlementId: settlementId}});
        res.json(settlementDetails);
    } catch (error) {
        next(error)
    }
}