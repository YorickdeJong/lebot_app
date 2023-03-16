const {Router} = require('express');

const {
    getAllMeasurementResults,
    getSpecificMeasurementResult,
    getLatestMeasurementResult,
    createMeasurementResult,
    updateMeasurementResult,
    deleteMeasurementResult
} = require('./measurementResults.controller')

const router = Router()

//use /api/v1/login end point and then do operations on that endpoint
// router.delete('/:id', deleteLogin)
router.get('/all/:id', getAllMeasurementResults);
router.get('/', getSpecificMeasurementResult);
router.get('/latest/:id', getLatestMeasurementResult);
router.post('/', createMeasurementResult);
router.put('/:record_number', updateMeasurementResult);
router.delete('/:id', deleteMeasurementResult);

module.exports = router;