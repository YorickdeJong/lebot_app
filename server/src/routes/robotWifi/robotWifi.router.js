

const { Router } = require('express');
const {
    getRobot,
    getRobotByGroupIdClassId,
    createRobots,
    updateRobot,
    deleteRobot,
    deleteRobots,
    assignSchoolToRobots
} = require('./robotWifi.controller');
const router = Router();

router.get('/school', getRobotByGroupIdClassId);
router.get('/', getRobot);
router.post('/', createRobots);
router.put('/assign-school/', assignSchoolToRobots);
router.put('/:id', updateRobot);
router.delete('/all', deleteRobots);
router.delete('/:id', deleteRobot);
module.exports = router;