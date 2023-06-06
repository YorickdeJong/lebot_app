const pool = require('../../services/postGreSQL');
const {
    getTimeLessonsByClassQuery,
    getAllTimeLessonsForClassQuery,
    getAllTimeLessonsForSchoolQuery,
    createTimeLessonQuery,
    updateTimeLessonQuery,
    deleteTimeLessonQuery,
    deleteAllLessonsForClassQuery,
    getTimeLessonsByIdQuery
} = require('./../../services/queries/queriesTimeLessons');

const getAllTimeLessonsForSchoolSocket = async (client, school_id) => {
    const values = [school_id]
    try {
        const { rows } = await client.query(getAllTimeLessonsForSchoolQuery, values);
    
        if (rows.length === 0) {
            return { error: 'No time lessons found', status: 400 };
        } 
        else {
            return { data: rows, status: 200 };
        }
    } 
    catch (error) {
        console.log(error);
        return { error: 'Error trying to get time lessons data', status: 500 };
    } 
  };


const getAllTimeLessonsForSchool = async (req, res) => {
    const {school_id} = req.query;
    const client = await pool.connect();
    const values = [school_id]
    try {
        const { rows } = await client.query(getAllTimeLessonsForSchoolQuery, values);
    
        if (rows.length === 0) {
            console.log('time lesson does not exist')
            return res.status(400).json({ error: 'Time lesson does not exist' });
        }
        else {
            console.log('got time lesson')
            return res.status(200).json(rows);
        }
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to get time lesson' });
    } 
    finally {
        client.release();
    }
  };


const createTimeLesson = async (req, res) => {
    const { class_id, duration, school_id, active, lesson } = req.body;
    const values = [class_id, duration, school_id, active, lesson];
    const client = await pool.connect();

    console.log('values', values)
    try {
        const { rows } = await client.query(getTimeLessonsByClassQuery, [lesson, class_id, school_id])
        if (rows.length > 0) {
            console.log('time lesson already exists')
            return res.status(400).json({ error: 'Time lesson already exists' });
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ error: 'Failed to create time lesson' });
    }

    try {
        const { rows } = await client.query(createTimeLessonQuery, values);
        if (rows.length > 0) {
            console.log('created table')
            return res.status(200).json(rows);
        }
        else {
            console.log('failed to create table')
            return res.status(500).json({ error: 'Failed to create time lesson' });
        }
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to create time lesson' });
    } 
    finally {
        client.release();
    }
};

const updateTimeLesson = async (req, res) => {
    const time_lesson_id = req.params.id;
    const { class_id, duration, school_id, active, lesson } = req.body;
    const values = [class_id, duration, school_id, active, lesson, time_lesson_id];

    console.log('time lesson values', values)
    const client = await pool.connect();

    try {
        const { rows } = await client.query(getTimeLessonsByIdQuery, [lesson, class_id, school_id])
        if (rows.length === 0) {
            console.log('time lesson does not exists')
            return res.status(400).json({ error: 'Time lesson does not exists' });
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ error: 'Failed to update time lesson' });
    }

    
    try {
        const { rows } = await client.query(updateTimeLessonQuery, values);
        console.log('updated time message')
        return res.status(200).json(rows);
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to update time lesson' });
    } 
    finally {
        client.release();
    }
};

const deleteTimeLesson = async (req, res) => {
    const time_lesson_id = req.params.id;
    const values = [time_lesson_id];
    const client = await pool.connect();

    try {
        const { rows } = await client.query(deleteTimeLessonQuery, values);

        if (rows.length === 0) {
            console.log('time lesson does not exist')
            return res.status(400).json({ error: 'Time lesson does not exist' });
        }
        else {
            console.log('deleted time lesson')
            return res.status(200).json(rows);
        }
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to delete time lesson' });
    } 
    finally {
        client.release();
    }
};

const deleteAllLessonsForClass = async (req, res) => {
    const class_id = req.params.id;
    const values = [class_id];
    const client = await pool.connect();

    try {
        const { rows } = await client.query(deleteAllLessonsForClassQuery, values);

        if (rows.length === 0) {
            console.log('time lesson does not exist')
            return res.status(400).json({ error: 'Time lesson does not exist' });
        }
        else {
            console.log('deleted time lesson')
            return res.status(200).json(rows);
        }
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to delete time lesson' });
    } 
    finally {
        client.release();
    }
};

module.exports = {
    getAllTimeLessonsForSchool,
    getAllTimeLessonsForSchoolSocket,
    createTimeLesson,
    updateTimeLesson,
    deleteTimeLesson,
    deleteAllLessonsForClass
};
