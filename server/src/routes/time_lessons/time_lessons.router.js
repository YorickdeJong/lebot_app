const { Router } = require('express');
const {
    getAllTimeLessonsForSchool,
    getAllTimeLessonsForSchoolSocket,
    getAllTimeLessonsId,
    createTimeLesson,
    updateTimeLesson,
    deleteTimeLesson,
    deleteAllLessonsForClass
} = require('./time_lessons.controller');
const router = Router();

router.get('/school', getAllTimeLessonsForSchool);
router.get('/:id', getAllTimeLessonsId);
router.post('/', createTimeLesson);
router.put('/:id', updateTimeLesson);
router.delete('/:id', deleteTimeLesson);
router.delete('/class/:id', deleteAllLessonsForClass);
module.exports = router;
