const pool = require('../../services/postGreSQL')

const {
    checkIfAssignmentDetailsExistsQuery,
    getSpecificAssignmentDetailsQuery,
    getUserAssignmentDetailsQuery,
    createAssignmentDetailsQuery,
    deleteAssignmentDetailsQuery
} = require('./../../services/queries/queryAssignmentDetails')


const getSpecificAssignmentDetails = async (req, res) => {
    const user_id = req.query.user_id;
    const assignment_id = req.query.assignment_id;
    console.log(user_id+ " " + assignment_id)
    const values = [user_id, assignment_id];
    const client = await pool.connect();

    try {
        const { rows } = await client.query(getSpecificAssignmentDetailsQuery, values);
        
        if (rows.length === 0){
            return res.status(404).json({message: 'User has no completed assignments yet'});
        }
        else {
            console.log(rows)
            return res.status(200).json(rows)
        }
    }
    catch (error){
        console.log(error);
        return res.status(500).json({error: 'Failed to get assignment status'});
    }

    finally {
        client.release();
    }    
}


const getUserAssignmentDetails = async (req, res) => {
    const client = await pool.connect();
    
    try {
        const user_id = req.query.user_id;
        console.log(user_id)
        const { rows } = await client.query(getUserAssignmentDetailsQuery, [user_id]);
        if (rows.length === 0){
            return res.status(404).json({message: 'User has no completed assignments yet'});
        }
        else {
            console.log(rows)
            return res.status(200).json(rows)
        }
        
    }
    catch (error){
        console.log(error);
        return res.status(500).json({error: 'Failed to get assignment status'});
    }
    
    finally {
        client.release();
    }
}


const createAssignmentDetails = async (req, res) => {
    const {user_id, assignment_id} = req.body
    

    const values = [user_id, assignment_id];
    const client = await pool.connect();

        
    try {
        const {rows} = await client.query(checkIfAssignmentDetailsExistsQuery, values);
        console.log(`rows: ${rows.length}`);
        if (rows.length > 0){
            return res.status(404).json({message: `Completed assignment with id ${assignment_id} already exists for user with id ${user_id}`});
        }
    }
    catch (error){
        return res.status(500).json({ message: error.message });
    }   

    try {
        const {rows} = await client.query(createAssignmentDetailsQuery, values);
        return res.status(200).json(rows);
    }
    catch (error){
        console.log(error);
        return res.status(500).json({error: 'Failed to get assignment status'});
    }
    
    finally {
        client.release();
    }
}

const deleteAssignmentDetails = async (req, res) => {
    const user_id = req.query.user_id;
    const assignment_id = req.query.assignment_id;

    const values = [user_id, assignment_id];
    const client = await pool.connect();

    try {
        const {rows} = await client.query(deleteAssignmentDetailsQuery, values);

        if (rows.length === 0){
            return res.status(404).json({message: `Assignment Detail with id ${assignment_id} not found`});
        }
        else {
            console.log(rows);
            return res.status(200).json('Succesfully deleted assignment detail');
        }
    }
    catch (error){
        console.log(error);
        return res.status(500).json({error: 'Failed to delete assignment detail'});
    }
    
    finally {
        client.release();
    }    
}


module.exports = {
    getSpecificAssignmentDetails,
    getUserAssignmentDetails,
    createAssignmentDetails,
    deleteAssignmentDetails
}