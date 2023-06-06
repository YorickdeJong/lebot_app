
const getTimeLessonsByIdQuery = `
    SELECT * FROM time_lesson WHERE id = $1;
`

const getTimeLessonsByClassQuery = `
    SELECT * FROM time_lesson WHERE lesson_number = $1 AND class_id = $2 AND school_id = $3;
`

const getAllTimeLessonsForClassQuery = `
    SELECT * FROM time_lesson WHERE school_id = $1 AND class_id = $2;
`

const getAllTimeLessonsForSchoolQuery = `
    SELECT * FROM time_lesson WHERE school_id = $1;
`

const createTimeLessonQuery = `
    INSERT INTO time_lesson (class_id, duration, school_id, active, lesson_number)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
`

const updateTimeLessonQuery = `
    UPDATE time_lesson
    SET class_id = $1, 
    duration = $2,
    school_id = $3, 
    active = $4, 
    lesson_number = $5,
    created_at = NOW()
    WHERE id = $6
    RETURNING *;
`

const deleteTimeLessonQuery = `
    DELETE FROM time_lesson WHERE id = $1 RETURNING *;
`

const deleteAllLessonsForClassQuery = `
    DELETE FROM time_lesson WHERE class_id = $1 RETURNING *;
`




module.exports = {
    getTimeLessonsByClassQuery,
    getAllTimeLessonsForClassQuery,
    getAllTimeLessonsForSchoolQuery,
    createTimeLessonQuery,
    updateTimeLessonQuery,
    deleteTimeLessonQuery,
    deleteAllLessonsForClassQuery,
    getTimeLessonsByIdQuery
}