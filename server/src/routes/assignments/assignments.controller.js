const pool = require('../../services/postGreSQL')
const {
    checkIfAssignmentExistsQuery,
    getAllAssignmentsQuery,
    getAssignmentQuery,
    getAssignmentIdByNumberQuery,
    createAssignmentQuery,
    updateAssignmentQuery,
    deleteAssignmentQuery
} = require('./../../services/queries/queryAssignment')

//get all assignments regardless of number or subject
const getAllAssignment = async (req, res) => {
    const client = await pool.connect();

    try {
        const {rows} = await client.query(getAllAssignmentsQuery);
        
        if (rows.length === 0) {
            return res.status(404).json('Assignments not found')
        }
        else {
            return res.status(200).json(rows)
        }
    }
    catch (error){
        console.log(error);
        return res.status(500).json({error: 'Failed to get assignment'})
    }       

    finally {
        client.release();
    }    
}


//gets assignment with id
const getAssignment = async (req, res) => {
    const client = await pool.connect();

    try {
        const assignment_number = req.query.assignment_number;  
        const title = req.query.title;

        console.log(assignment_number)
        const {rows} = await client.query(getAssignmentQuery, [assignment_number, title]);
        
        if (rows.length === 0) {
            return res.status(404).json('Assignment not found')
        }
        else {
            console.log(rows);
            return res.status(200).json(rows)
        }
    }
    catch (error){
        console.log(error);
        return res.status(500).json({error: 'Failed to get assignment'})
    }       

    finally {
        client.release();
    }    
}

const getAssignmentIdByNumber = async (req, res) => {
    const client = await pool.connect();
    
    try {
        const assignment_number = req.query.assignment_number;
        const title = req.query.title
        const {rows} = await client.query(getAssignmentIdByNumberQuery, [assignment_number, title]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Assignment not found' });
        } 
        else {
            console.log(rows)
            return res.status(200).json(rows);
        }
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to get assignment ID' });
    }
    
    finally {
        client.release();
    }    

};


const createAssignment = async (req, res) => {
    const client = await pool.connect();
    const {assignment_number, subject, title, question, answer, image_file_path, currency} = req.body;
    
    try {
        const {rows} = await client.query(checkIfAssignmentExistsQuery, [assignment_number, title]);
        console.log(`rows is: ${rows}`)
        if (rows.length > 0){
            return res.status(400).json({message: `Assignment with assignment number ${assignment_number} already exists`})
        }
    }
    catch (error){
        console.log(error)
        return res.status(500).json({error: 'Failed to check if assignment exitst'})
    }

    try {
        const values = [assignment_number, subject, title, question, answer, image_file_path, currency]
        const result = await client.query(createAssignmentQuery, values);

        console.log(result);
        return res.status(200).json('Succesfully added assignment')
    }
    catch (error){
        console.log(error);
        return res.status(500).json({error: "Failed to create assignment"})
    }   

    finally {
        client.release();
    }    
}

const updateAssignment = async (req, res) => { //Could be used for users that want to add their own assignment
    const client = await pool.connect();
    
    try {
        const assignment_id = req.params.id;
        const {assignment_number, subject, title, question, answer, image_file_path, currency} = req.body;
        const values = [assignment_number, subject, title, question, answer, image_file_path, currency, assignment_id];

        const {rows} = await client.query(updateAssignmentQuery, values);

        if (rows.length === 0){
            return res.status(404).json({message: `Assignment with id ${assignment_id} not found`})
        }
        else {
            console.log(rows);
            return res.status(200).json('Succesfully update assignment')
        }
    }
    catch (error){
        console.log(error)
        return res.status(500).json({error: 'Failed to update assignment'});
    }

    finally {
        client.release();
    }    
}


const deleteAssignment = async (req, res) => {
    const client = await pool.connect();

    try {
        const assignment_id = req.params.id;
        const title = req.query.title
        const {rows} = await client.query(deleteAssignmentQuery, [assignment_id, title]);

        if (rows.length === 0){
            return res.status(404).json({message: `Assignment with id ${assignment_id} not found`})
        }
        else {
            console.log(rows);
            return res.status(200).json('Succesfully deleted assignment')
        }
    }
    catch (error){
        console.log(error);
        return res.status(500).json({error: 'Failed to delete assignment'});
    }
    
    finally {
        client.release();
    }    
}

module.exports = {
    getAllAssignment,
    getAssignment,
    getAssignmentIdByNumber,
    createAssignment,
    updateAssignment,
    deleteAssignment
}