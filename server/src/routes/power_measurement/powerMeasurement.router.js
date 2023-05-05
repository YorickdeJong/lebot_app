const {Router} = require('express');

const {
    getAllMeasurementResults,
    getSpecificPowerMeasurementResult,
    getLatestPowerMeasurementResult,
    updatePowerMeasurementResult,
    deletePowerMeasurementResult
} = require('./powerMeasurement.controller')

const router = Router()

//use /api/v1/login end point and then do operations on that endpoint
router.get('/all', getAllMeasurementResults);
router.get('/', getSpecificPowerMeasurementResult);
router.get('/latest/:id', getLatestPowerMeasurementResult);
router.put('/:record_number', updatePowerMeasurementResult);
router.delete('/', deletePowerMeasurementResult);

module.exports = router;