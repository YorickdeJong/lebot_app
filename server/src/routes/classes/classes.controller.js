const pool = require('../../services/postGreSQL');

const {
    getIndividualClassQuery,
    getClassesPerSchoolQuery,
    checkIfClassForSchoolExistsQuery,
    createClassQuery,
    updateClassQuery,
    deleteClassQuery,
    getAllClassesQuery
} = require('./../../services/queries/queryClasses');

const getClassesPerSchool = async (client, school_id) => {
    const values = [school_id];
    console.log('getClassesPerSchool - values', values)
    
    try {
        const { rows } = await client.query(getClassesPerSchoolQuery, values);
        console.log('getClassesPerSchool - rows: ', rows);
        if (rows.length === 0) {
            return { message: 'No classes found', status: 404 }
        } 
        else {
            console.log('getClassesPerSchool - rows', rows);
            return { data: rows, status: 200 };
        }
    } 
    catch (error) {
        console.log('getClassesPerSchool - failed to get classes')
        console.log(error);
        return { error: 'Failed to get all classes', status: 500 }
    } 
};


const getAllClassesPerSchool = async (req,res) => {
    const client = await pool.connect();
    
    try {
        const { rows } = await client.query(getAllClassesQuery);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No classes found'})
        } 
        else {
            console.log('getClassesPerSchool - rows', rows);
            return res.status(200).json({ data: rows });
        }
    } 
    catch (error) {
        console.log('getClassesPerSchool - failed to get classes')
        console.log(error);
        return res.status(500).json({ error: 'Failed to get all classes'})
    } 
    finally {
        console.log('getClassesPerSchool - released client classes per school')
        client.release();
    }
};



const getIndividualClass = async (req, res) => {
    const class_id = req.params.id;
    const values = [class_id];
    const client = await pool.connect();

    try {
        const { rows } = await client.query(getIndividualClassQuery, values);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Class does not exist' });
        } else {
            console.log(rows);
            return res.status(200).json(rows);
        }
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to get class' });
    } 
    finally {
        client.release();
    }
};
 

const createClass = async (req, res) => {
    const { name, school_id, max_count } = req.body;
    const values = [name, school_id, max_count];
    const client = await pool.connect();

    try {
        const { rows } = await client.query(checkIfClassForSchoolExistsQuery, [school_id, name]);
        console.log(`rows: ${rows.length}`);

        if (rows.length > 0) {
            console.log('class exists');
            return res.status(404).json({ message: `class with name ${values[0]} already exists` });
        }
    } 
    catch (error) {
        return res.status(500).json({ message: error.message });
    }

    try {
        const { rows } = await client.query(createClassQuery, values);
        console.log(rows);
        console.log('successfully added class');
        return res.status(200).json(rows);
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to create class' });
    } 
    finally {
        client.release();
    }
};


const updateClass = async (req, res) => {
    const client = await pool.connect();
    const class_id = req.params.id;

    try {
        const { name, max_count, school_id } = req.body;
        const values = [name, max_count, school_id, class_id];
        console.log(values)

        const { rows } = await client.query(updateClassQuery, values);
        console.log(rows)
        if (rows.length === 0) {
            console.log('class does not exist')
            return res.status(404).json({ message: `class with id ${class_id} not found` });
        } 
        else {
            console.log(rows);
            return res.status(200).json(`Successfully updated class to ${name}`);
        }
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: `Failed to update class with name ${name}` });
    } 
    finally {
        client.release();
    }
};

const deleteClassByID = async (req, res) => {
    const class_id = req.params.id;

    const values = [class_id];
    const client = await pool.connect();

    try {
        const { rows } = await client.query(deleteClassQuery, values);

        if (rows.length === 0) {
            return res.status(404).json({ message: `Class with id ${class_id} not found` });
        } else {
            console.log('deleted class');
            return res.status(200).json(rows);
        }
    } catch (error) {
        console.log('failed to delete class by id')
        console.log(error);
        return res.status(500).json({ error: 'Failed to delete class' });
    } finally {
        client.release();
    }
};

module.exports = {
    getIndividualClass,
    getClassesPerSchool,
    createClass,
    updateClass,
    deleteClassByID,
    getAllClassesPerSchool
}