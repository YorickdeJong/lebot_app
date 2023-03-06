const {Router} = require('express');

const {
    getAllAssignment,
    getAssignment,
    getAssignmentIdByNumber,
    createAssignment,
    updateAssignment,
    deleteAssignment
} = require('./assignments.controller')

const router = Router()

router.get('/all', getAllAssignment);
router.get('/specific', getAssignment);
router.get('/', getAssignmentIdByNumber)
router.post('/', createAssignment);
router.put('/:id', updateAssignment);
router.delete('/:id', deleteAssignment);

module.exports = router;