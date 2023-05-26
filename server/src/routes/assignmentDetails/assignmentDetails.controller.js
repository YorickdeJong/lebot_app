const pool = require('../../services/postGreSQL')

const {
    checkIfAssignmentDetailsExistsQuery,
    getSpecificAssignmentDetailsQuery,
    getGroupAssignmentDetailsQuery,
    createAssignmentDetailsQuery,
    deleteAssignmentDetailsQuery,
    updateAssignmentDetailsQuery
} = require('./../../services/queries/queryAssignmentDetails')


const getSpecificAssignmentDetails = async (req, res) => {
    const {school_id, class_id, group_id, assignment_id, subject} = req.query;     
    const values = [school_id, class_id, group_id, assignment_id, subject];
    const client = await pool.connect();

    console.log('values', values)
    try {
        const { rows } = await client.query(getSpecificAssignmentDetailsQuery, values);
        
        if (rows.length === 0){
            console.log('Assignment info not found')
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


const getGroupAssignmentDetails = async (req, res) => {
    const client = await pool.connect();
    
    try {
        const { school_id, class_id, group_id } = req.query;
        const values = [school_id, class_id, group_id];
        console.log('values', values)
        const { rows } = await client.query(getGroupAssignmentDetailsQuery, values);
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
    const {school_id, class_id, group_id, assignment_id, subject, answers_multiple_choice, answers_open_questions} = req.body

    const values = [school_id, class_id, group_id, assignment_id, subject, answers_multiple_choice, answers_open_questions];

    const client = await pool.connect();

    console.log('values', values)
    try {
        const { rows } = await client.query(checkIfAssignmentDetailsExistsQuery, [school_id, class_id, group_id, assignment_id, subject]);
        console.log(`rows: ${rows.length}`);
        if (rows.length > 0) {
          console.log(`Updating assignment with id ${assignment_id} for group with id ${group_id}`);
          const updateValues = [subject, answers_open_questions, answers_multiple_choice, school_id, class_id, group_id, assignment_id];
          const { rows: updatedRows } = await client.query(updateAssignmentDetailsQuery, updateValues);
          return res.status(200).json(updatedRows);
        }
    }
    catch (error){
        console.log(error);
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
    const {school_id, class_id, group_id, assignment_id, subject} = req.body

    const values = [school_id, class_id, group_id, assignment_id, subject];
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
    getGroupAssignmentDetails,
    createAssignmentDetails,
    deleteAssignmentDetails
}