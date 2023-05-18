const pool = require('../../services/postGreSQL');
const {
    getUsersInClassQuery,
    createClassUserQuery,
    updateClassUserQuery,
    deleteClassUserQuery,
    checkUserClassQuery,
    checkClassSpaceQuery,
    deleteClassInfoQuery
} = require('./../../services/queries/queriesClassesInfo');


const {
    getIndividualClassQuery,
} = require('./../../services/queries/queryClasses');

const getUsersInClass = async (client, class_id) => {
    console.log('classdata', class_id)

    const values = [class_id];

    try {
        const { rows } = await client.query(getUsersInClassQuery, values);
        console.log(`rows class_id ${class_id}: `, rows)
        return { count: rows[0].count, status: 200 };
    } 
    catch (error) {
        console.error(error);
        return { error: 'Server error', status: 500 }
    } 
};


const createClassUser = async (req, res) => {
    const { user_id, class_id } = req.body;
    const values = [user_id, class_id];
    const client = await pool.connect();
    let currentCount = 0;

    try {
        console.log('Executing checkUserClassQuery');
        const checkResult = await client.query(checkUserClassQuery, [user_id]);
        console.log('check', checkResult)

        if (checkResult.rowCount > 0) {
            console.log('Executing deleteClassUserQuery');
            await client.query(deleteClassUserQuery, [user_id]);
        }

        console.log('Executing checkClassSpaceQuery');
        const classSpaceResult = await client.query(checkClassSpaceQuery, [class_id]);

        if (classSpaceResult.rowCount === 0) {
            console.log('No users in class yet')
        } 
        else {
            currentCount = classSpaceResult.rows[0].count;
        }

        console.log('Executing getIndividualClassQuery');
        const classResult = await client.query(getIndividualClassQuery, [class_id]);
        const maxCount = classResult.rows[0].max_count;

        if (currentCount >= maxCount) {
            return res.status(400).json({ error: 'The selected class is already full.' });
        }

        console.log('Executing createClassUserQuery');
        const { rows } = await client.query(createClassUserQuery, values);
        return res.status(200).json(rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
    finally {
        client.release();
    }
};

const updateClassUser = async (req, res) => {
    const user_id = req.params.id;
    const { class_id } = req.body;
    const values = [user_id, class_id];
    const client = await pool.connect();

    try {
        const { rows } = await client.query(updateClassUserQuery, values);
        return res.status(200).json(rows[0]);
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    } 
    finally {
        client.release();
    }
};

const deleteClassUser = async (req, res) => {
    const user_id = req.params.id;
    const values = [user_id];
    const client = await pool.connect();
    console.log('values', values)

    if (!values[0]){
        return res.status(400).json({ error: 'Missing required parameters' });
    }
    try {
        const { rows } = await client.query(deleteClassUserQuery, values);

        if (rows.length === 0) {
            return res.status(404).json({ message: `user with id ${user_id} not found` });
        } 
        else {
            console.log('deleted user from classes_users');
            return res.status(200).json(rows);
        }
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    } 
    finally {
        client.release();
    }
};

const deleteClassInfo = async (req, res) => {
    const class_id  = req.params.id;
    const values = [class_id];
    const client = await pool.connect();
    console.log('values', values)

    if (!values[0]){
        return res.status(400).json({ error: 'Missing required parameters' });
    }
    try {
        const { rows } = await client.query(deleteClassInfoQuery, values);

        if (rows.length === 0) {
            console.log('class with id 18 not found')
            return res.status(404).json({ message: `class with id ${class_id} not found` });
        } 
        else {
            console.log('deleted class from classes_users');
            return res.status(200).json(rows);
        }
    } 
    catch (error) {
        console.log('failed to delete class info ')
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    } 
    finally {
        client.release();
    }
};

module.exports = {
    createClassUser,
    updateClassUser,
    deleteClassUser,
    getUsersInClass,
    deleteClassInfo
};