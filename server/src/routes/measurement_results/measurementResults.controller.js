const pool = require('../../services/postGreSQL')

const {
    getAllMeasurementResultsQuery,
    getSpecificMeasurementResultQuery,
    getLatestMeasurementResultQuery,
    createMeasurementResultQuery,
    updateMeasurementResultQuery,
    existInDatabaseQuery,
    deleteMeasurementResultQuery
} = require('../../services/queries/queryMeasurementResults')


const getAllMeasurementResults = async (req, res) => {
    //supply both user_id and assignment_id
    const client = await pool.connect();

    try {
        const user_profile_id = req.params.id;
        console.log(user_profile_id);
        const {rows} = await client.query(getAllMeasurementResultsQuery, [user_profile_id]);
        console.log(rows);

        if (rows.length === 0) {
            return res.status(400).json({error: 'No results found'})
        }
        else {
            return res.status(200).json(rows)
        }
    } 
    catch (error){
        console.log(error)
        return res.status(500).json({error: 'Error trying to get results data'})
    }

    finally {
        client.release(); 
    }
}

const getSpecificMeasurementResult = async (req, res) => {
    //supply both user_id and assignment_id
    const client = await pool.connect();

    try {
        const {school_id, class_id, group_id, assignment_number, title, subject} = req.query;
        console.log(school_id, class_id, group_id, assignment_number, title, subject)
        const {rows} = await client.query(getSpecificMeasurementResultQuery, [assignment_number, title, subject, school_id, class_id, group_id]);
        console.log(rows);

        if (rows.length === 0) {
            return res.status(400).json({error: 'results for specific assignment do not exits'})
        }
        return res.status(200).json(rows)
        
    } 
    catch (error){
        console.log(error)
        return res.status(500).json({error: 'Error trying to get results data'})
    }

    finally {
        client.release(); 
    }
}


const getLatestMeasurementResult = async (user_profile_id) => {
    //supply both user_id and assignment_id
    const client = await pool.connect();

    try {
        const {rows} = await client.query(getLatestMeasurementResultQuery, [user_profile_id]);

        if (rows.length === 0) {
            // return an error object instead of using res.status
            return { error: 'No results found' };
        }
        else {
            // return the rows directly instead of using res.status
            return rows;
        }
    } 
    catch (error){
        console.log(error)
        // return an error object instead of using res.status
        return { error: 'Error trying to get results data' };
    }

    finally {
        client.release(); 
    }
};

// creates/ updates measurement
const updateMeasurementResult = async (req, res) => {
    const client = await pool.connect();

    const record_number = req.params.record_number;
    const { school_id, class_id, group_id, assignment_number, distance, velocity, time, user_id, title, type, motor_number, subject } = req.body;

    const values = [school_id, class_id, group_id, assignment_number, distance, velocity, time, user_id, title, type, motor_number, subject, record_number];

    // Check if the measurement result exists in the database
    const checkExistsQuery = existInDatabaseQuery;
    const checkExistsValues = [record_number];
    const { rows: existingRows } = await client.query(checkExistsQuery, checkExistsValues);

    if (existingRows.length === 0) {
        try {
            const { rows } = await client.query(createMeasurementResultQuery, values);
            return res.status(201).json(rows[0]);
        } 
        catch (error) {
            console.log(`Could not create measurement result: ${error}`);
            return res.status(500).json({ message: 'Internal server error' });
        }
        finally {
            client.release();
        }  
    } 
    else {
        try {
            const { rows } = await client.query(updateMeasurementResultQuery, values);
            return res.status(200).json(rows[0]);
        } 
        catch (error) {
            console.log(`Could not update measurement result: ${error}`);
            return res.status(500).json({ message: 'Internal server error' });
        }
        finally {
            client.release();
        }   
    } 
}

const deleteMeasurementResult = async (req, res) => {
    const client = await pool.connect();

    try {
        const { record_number } = req.query;
        const {rows} = await client.query(deleteMeasurementResultQuery, [record_number]);
        
        if (rows.length === 0){
            return res.status(404).json({error: `Results with time ${record_number} was not found`})
        }
        else {
            console.log('Deleted result')
            return res.status(200).json('Succesfully deleted result');
        }
    }
    catch (error){
        console.log(error)
        return res.status(500).json({error: 'Failed to delete result'});
    }

    finally {
        client.release(); 
    }
}

module.exports = {
    getAllMeasurementResults,
    getSpecificMeasurementResult,
    getLatestMeasurementResult,
    updateMeasurementResult,
    deleteMeasurementResult
}