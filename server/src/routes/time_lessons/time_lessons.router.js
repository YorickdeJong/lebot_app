const { Router } = require('express');
const {
    getAllTimeLessonsForSchool,
    getAllTimeLessonsForSchoolSocket,
    createTimeLesson,
    updateTimeLesson,
    deleteTimeLesson,
    deleteAllLessonsForClass
} = require('./time_lessons.controller');
const router = Router();

router.get('/school', getAllTimeLessonsForSchool);
router.post('/', createTimeLesson);
router.put('/:id', updateTimeLesson);
router.delete('/:id', deleteTimeLesson);
router.delete('/class/:id', deleteAllLessonsForClass);
module.exports = router;
