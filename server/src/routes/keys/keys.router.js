
const {Router} = require('express');
const {
    getSpecificKey,
    getAllKeysForSchool,
    createKeys,
    updateKey,
    deleteAllSchoolKeys,
    deleteSpecificKey
} = require('./keys.controller');
const router = Router()

//use /api/v1/login end point and then do operations on that endpoint
router.get('/', getSpecificKey);
router.get('/all', getAllKeysForSchool);
router.put('/:id', updateKey);
router.post('/', createKeys);
router.delete('/all/:school_name', deleteAllSchoolKeys);
router.delete('/:uuid_key', deleteSpecificKey);

module.exports = router;