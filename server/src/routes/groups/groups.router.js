
const {Router} = require('express');
const {
    getIndividualGroup,
    getGroupsPerClassRoomRequest,
    getGroupsPerClassRoom,
    getGroupsPerSchool,
    createGroup,
    updateGroup,
    deleteGroupByID,
    deleteGroupsInClass
} = require('./groups.controller');
const router = Router()

//use /api/v1/login end point and then do operations on that endpoint
router.get('/classroom', getGroupsPerClassRoom)
router.get('/request-classroom', getGroupsPerClassRoomRequest)
router.get('/:id', getIndividualGroup);
router.get('/school', getGroupsPerSchool);
router.put('/:id', updateGroup);
router.post('/', createGroup);
router.delete('/:id', deleteGroupByID);
router.delete('/all/:id', deleteGroupsInClass);

module.exports = router;