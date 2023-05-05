
const {Router} = require('express');
const {
    getSpecificSchool,
    getAllSchools,
    updateSchool,
    createSchool,
    deleteSchoolByName,
    deleteSchoolByID
} = require('./schools.controller');
const router = Router()

//use /api/v1/login end point and then do operations on that endpoint
router.get('/', getSpecificSchool);
router.get('/all', getAllSchools);
router.put('/:id', updateSchool);
router.post('/', createSchool);
router.delete('/name/:school_name', deleteSchoolByName);
router.delete('/id/:id', deleteSchoolByID);

module.exports = router;