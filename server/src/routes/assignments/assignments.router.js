const {Router} = require('express');

const {
    insertAssignment,
    getAssignmentsForUser,
    updateCompletionStatus
} = require('./assignments.controller')

const router = Router()

//use /api/v1/login end point and then do operations on that endpoint
// router.delete('/:id', deleteLogin)
router.get('/', getAssignmentsForUser)
router.post('/', insertAssignment)
router.put('/:id', updateCompletionStatus)

module.exports = router;