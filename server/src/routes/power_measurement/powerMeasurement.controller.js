const pool = require('../../services/postGreSQL')

const {
    getSpecificPowerMeasurementResultQuery,
    getLatestMeasurementResultQuery,
    createPowerMeasurementResultQuery,
    updatePowerMeasurementResultQuery,
    deletePowerMeasurementResultQuery,
    existInDatabaseQuery,
} = require('../../services/queries/power_measurement')

const getSpecificPowerMeasurementResult = async (req, res) => {
    //supply both user_id and assignment_id
    const client = await pool.connect();

    try {
        const {user_profile_id, assignment_number, title, subject} = req.query;
        const {rows} = await client.query(getSpecificPowerMeasurementResultQuery, [assignment_number, user_profile_id, title, subject]);
       
        console.log(rows);
        console.log(user_profile_id + " " + assignment_number + " " + title);

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

const getLatestPowerMeasurementResult = async (user_profile_id) => {
    const client = await pool.connect();
  
    try {
        const { rows } = await client.query(getLatestMeasurementResultQuery, [user_profile_id]);
    
        if (rows.length === 0) {
            return { error: 'No results found', status: 400 };
        } 
        else {
            return { data: rows, status: 200 };
        }
    } 
    catch (error) {
        console.log(error);
        return { error: 'Error trying to get results data', status: 500 };
    } 
    finally {
        client.release();
    }
  };

// creates/ updates measurement
const updatePowerMeasurementResult = async (req, res) => {
    const client = await pool.connect();

    const record_number = req.params.record_number;
    const { assignment_number, power, time, user_id, title, subject } = req.body;

    const values = [assignment_number, power, time, user_id, title, subject, record_number];

    // Check if the measurement result exists in the database
    const checkExistsValues = [record_number];
    const { rows: existingRows } = await client.query(existInDatabaseQuery, checkExistsValues);

    if (existingRows.length === 0) {
        try {
            const { rows } = await client.query(createPowerMeasurementResultQuery, values);
            return res.status(201).json(rows[0]);
        } 
        catch (error) {
            console.log(`Could not create power measurement result: ${error}`);
            return res.status(500).json({ message: 'Internal server error' });
        }
        finally {
            client.release();
        }  
    } 
    else {
        try {
            const { rows } = await client.query(updatePowerMeasurementResultQuery, values);
            return res.status(200).json(rows[0]);
        } 
        catch (error) {
            console.log(`Could not update power measurement result: ${error}`);
            return res.status(500).json({ message: 'Internal server error' });
        }
        finally {
            client.release();
        }   
    } 
}

const deletePowerMeasurementResult = async (req, res) => {
    const client = await pool.connect();

    try {
        const { record_number } = req.query;
        const {rows} = await client.query(deletePowerMeasurementResultQuery, [record_number]);
        
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
    getSpecificPowerMeasurementResult,
    getLatestPowerMeasurementResult,
    updatePowerMeasurementResult,
    deletePowerMeasurementResult
}