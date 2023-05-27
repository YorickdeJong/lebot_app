const pool = require('../../services/postGreSQL')

const {
    getSpecificKeyQuery,
    getAllKeysForSchoolQuery,
    createKeyQuery,
    updateKeyQuery,
    deleteAllSchoolKeyQuery,
    deleteSpecificKeyQuery
} = require('./../../services/queries/queryKeys')

// Get a specific key
const getSpecificKey = async (req, res) => {
    const uuid_key = req.query.uuid_key;
    const values = [uuid_key];
    const client = await pool.connect();

    try {
        const { rows } = await client.query(getSpecificKeyQuery, values);

        if (rows.length === 0) {
            rows = false;
            return res.status(404).json(rows);
        } 
        else {
            return res.status(200).json(rows);
        }
    } 
    catch (error) {
        console.log(error);
        rows = false;
        return res.status(500).json(rows);
    } 
    finally {
        client.release();
    }
}

// Get all keys in the database for a specific school
const getAllKeysForSchool = async (req, res) => {
    const school_name = req.query.school_name;
    const values = [school_name];
    const client = await pool.connect();

    try {
        const { rows } = await client.query(getAllKeysForSchoolQuery, values);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No keys found for this school' });
        } 
        else {
            return res.status(200).json(rows);
        }
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to get keys for this school' });
    } 
    finally {
        client.release();
    }
}

// Create new keys
const createKeys = async (req, res) => {
    const keys = req.body.keys;
    const client = await pool.connect();
    console.log('keys', keys)

    try {
        await client.query('BEGIN');

        //allows to add multiple keys
        const createdKeys = [];
        for (const key of keys) {
            const { uuid_key, school_id, school_name, user_role } = key;
            console.log('key', key)
            const values = [uuid_key, school_id, school_name, user_role];
            console.log('values', values)
            const { rows } = await client.query(createKeyQuery, values);
            console.log('returned values', rows[0])
            createdKeys.push(rows[0]);
        }

        await client.query('COMMIT');
        return res.status(201).json({ message: 'Keys created successfully', keys: createdKeys });

    } 
    catch (error) {
        await client.query('ROLLBACK');
        console.log(error);
        return res.status(500).json({ error: 'Failed to create keys' });
    } 
    finally {
        client.release();
    }
};

// Update an existing key
const updateKey = async (req, res) => {
    const uuid_key = req.params.uuid_key;
    const user_role = req.body.user_role;
    const values = [user_role, uuid_key];
    const client = await pool.connect();

    try {
        const { rows } = await client.query(updateKeyQuery, values);

        if (rows.rowCount === 0) {
            return res.status(404).json({ message: `Key not found` });
        } else {
            return res.status(200).json({ message: `Key updated successfully`, key: rows[0] });
        }
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: `Failed to update key` });
    }
    finally {
        client.release();
    }
}


// Delete all keys for a specific school
const deleteAllSchoolKeys = async (req, res) => {
    const school_name = req.params.school_name;
    const values = [school_name];
    const client = await pool.connect();
    console.log(school_name)
    try {
        const { rows } = await client.query(deleteAllSchoolKeyQuery, values);

        if (rows.length === 0) {
            console.log(`No keys found for the school with name ${school_name}`)
            return res.status(404).json({ message: `No keys found for the school with name ${school_name}` });
        } 
        else {
            console.log('successfully deleted keys')
            return res.status(200).json({ message: 'All keys deleted successfully', keys: rows });
        }
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to delete keys' });
    } 
    finally {
        client.release();
    }
}

// Delete a specific key
const deleteSpecificKey = async (req, res) => {
    const uuid_key = req.params.uuid_key;
    console.log(uuid_key)
    const values = [uuid_key];
    const client = await pool.connect();

    try {
        const { rows } = await client.query(deleteSpecificKeyQuery, values);

        if (rows.length === 0) {
            return res.status(404).json({ message: `Key not found` });
        } 
        else {
            return res.status(200).json({ message: 'Key deleted successfully', key: rows[0] });
        }
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to delete key' });
    } 
    finally {
        client.release();
    }
}

// Export the functions
module.exports = {
    getSpecificKey,
    getAllKeysForSchool,
    createKeys,
    updateKey,
    deleteAllSchoolKeys,
    deleteSpecificKey
}