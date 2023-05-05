const { Router } = require('express');
const {
    getIndividualClass,
    getClassesPerSchool,
    createClass,
    updateClass,
    deleteClassByID,
    getAllClassesPerSchool
} = require('./classes.controller');
const router = Router();

router.get('/all', getAllClassesPerSchool);
router.get('/school', getClassesPerSchool);
router.get('/:id', getIndividualClass);
router.put('/:id', updateClass);
router.post('/', createClass);
router.delete('/:id', deleteClassByID);

module.exports = router;