
const {Router} = require('express');
const {
    getSpecificAssignmentDetails,
    getUserAssignmentDetails,
    createAssignmentDetails,
    deleteAssignmentDetails
} = require('./assignmentDetails.controller')
const router = Router()

//use /api/v1/login end point and then do operations on that endpoint
router.get('/specific', getSpecificAssignmentDetails);
router.get('/all', getUserAssignmentDetails);
router.post('/', createAssignmentDetails);
router.delete('/', deleteAssignmentDetails);

module.exports = router;