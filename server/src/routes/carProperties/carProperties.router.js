const {Router} = require('express');

const {
    getAllCarDetails,
    getCarDetails,
    createCarDetails,
    updateCarDetails,
    deleteCarDetails,
    deleteCarId
} = require('./carProperties.controller')

const router = Router()

//use /api/v1/login end point and then do operations on that endpoint
// router.delete('/:id', deleteLogin)
router.get('/', getAllCarDetails)
router.get('/:id', getCarDetails);
router.post('/', createCarDetails);
router.put('/:id', updateCarDetails);
router.delete('/:id', deleteCarDetails);
router.delete('/carID/:id', deleteCarId);

module.exports = router;