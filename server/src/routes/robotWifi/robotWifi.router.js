

const { Router } = require('express');
const {
    getRobot,
    createRobot,
    updateRobot,
    deleteRobot
} = require('./robotWifi.controller');
const router = Router();

router.get('/', getRobot);
router.post('/', createRobot);
router.put('/:id', updateRobot);
router.delete('/:id', deleteRobot);

module.exports = router;