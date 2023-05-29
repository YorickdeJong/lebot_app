const pool = require('../../services/postGreSQL');
const {
    getBrainstormTextQuery,
    createBrainstormTextQuery,
    updateBrainstormTextQuery,
    deleteBrainstormTextQuery
} = require('./../../services/queries/think_screen_queries');




const getBrainstormText = async (req, res) => {
    const {user_id, assignment_number, subject} = req.query;
    const values = [user_id, assignment_number, subject];
    const client = await pool.connect();

    try {
        const { rows } = await client.query(getBrainstormTextQuery, values);

        if (rows.length === 0){
            return res.status(404).json({message: 'brainstorm text does not exist'});
        }
        else {
            console.log(rows)
            return res.status(200).json(rows)
        }
    }
    catch (error){
        console.log(error);
        return res.status(500).json({error: 'Failed to get brainstorm text'});
    }

    finally {
        client.release();
    }    
}

const createUpdateBrainstormText = async (req, res) => {
    const {user_id, subject, assignment_number, text_one, text_two, text_three, text_four} = req.body
    const valuesCreate = [user_id, subject, assignment_number, text_one, text_two, text_three, text_four];
    const valuesUpdate = [text_one, text_two, text_three, text_four, user_id, assignment_number, subject];
    console.log('values', valuesCreate);
    
    const client = await pool.connect();
    

    //check if exists
    try {
        const { rows } = await client.query(getBrainstormTextQuery, [user_id, assignment_number, subject]);
        if (rows.length !== 0){
            const {rows} = await client.query(updateBrainstormTextQuery, valuesUpdate);
            console.log('successfully updated brainstorm text')
            return res.status(200).json(rows);
        }
        else {
            const { rows } = await client.query(createBrainstormTextQuery, valuesCreate);
            console.log('successfully added assignment')
            return res.status(200).json(rows);
        }
    }
    catch (error){
        console.log('Failed to create or update fetch barinstorm text', error);
        return res.status(500).json({error: 'Failed to add brainstorm text'});
    }
    
    finally {
        client.release();
    }
}

const updateBrainstormText = async (req, res) => {
    const client = await pool.connect();
    const {user_id, assignment_number, subject} = req.params;
    const {text_one, text_two, text_three, text_four} = req.body;
    
    try {
        const values = [text_one, text_two, text_three, text_four, user_id, assignment_number, subject];
        const { rows } = await client.query(updateBrainstormTextQuery, values);

        if (rows.length === 0){
            return res.status(404).json({message: `brainstorm text not found`})
        }
        else {
            console.log(rows);
            return res.status(200).json(`Successfully updated brainstorm text`)
        }
    }
    catch (error){
        console.log(error)
        return res.status(500).json({error: `Failed to update brainstorm text`});
    }

    finally {
        client.release();
    }    
}


const deleteBrainstormText = async (req, res) => {
    const {user_id, assignment_number, subject} = req.params;

    const values = [user_id, assignment_number, subject];
    const client = await pool.connect();

    try {
        const {rows} = await client.query(deleteBrainstormTextQuery, values);

        if (rows.length === 0){
            return res.status(404).json({message: `brainstorm text not found`});
        }
        else {
            console.log('Deleted brainstorm text');
            return res.status(200).json(rows);
        }
    }
    catch (error){
        console.log(error);
        return res.status(500).json({error: 'Failed to delete brainstorm text'});
    }
    
    finally {
        client.release();
    }    
}


module.exports = {
    getBrainstormText,
    createUpdateBrainstormText,
    updateBrainstormText,
    deleteBrainstormText
}