const bcrypt = require('bcryptjs');
const pool = require('../../services/postGreSQL')



const getRobot = async (req, res) => {
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT * FROM robots');
        if(rows.length === 0) throw new Error('Robot does not exist');
        res.status(200).json(rows);  // send the robot data back to the client
    } 
    catch(err) {
        console.error(`Error in getRobot: ${err.message}`);
        res.status(500).send(err.message);
    } 
    finally {
        client.release();
    }
}

const createRobot = async (req, res) =>  {
    const client = await pool.connect();
    const robotId = req.body.robotId;  // or however you receive the robot id in the request
    const plainPassword = req.body.password; // assuming you receive the password in the request body

    try {
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        const result = await client.query('INSERT INTO robots (robot_id, password) VALUES ($1, $2) RETURNING *', [robotId, hashedPassword]);
        if(result.rows.length === 0) throw new Error('Failed to create robot');
        res.status(200).json(result.rows[0]); // send the created robot data back to the client
    } 
    catch(err) {
        console.error(`Error in createRobot: ${err.message}`);
        res.status(500).send(err.message);
    } 
    finally {
        client.release();
    }
}


const updateRobot = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;  // or however you receive the robot id in the request
    const  plainPassword = req.body.password; // assuming you receive the password in the request body
    try {
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        const result = await client.query('UPDATE robots SET password = $1 WHERE id = $2 RETURNING *', [hashedPassword, id]);
        if(result.rows.length === 0) throw new Error('Failed to update robot');
        res.status(200).json(result.rows[0]); // send the updated robot data back to the client
    } 
    catch(err) {
        console.error(`Error in updateRobot: ${err.message}`);
        res.status(500).send(err.message);
    } 
    finally {
        client.release();
    }
}

const deleteRobot = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;  // or however you receive the robot id in the request
    try {
        const result = await client.query('DELETE FROM robots WHERE id = $1 RETURNING *', [id]);
        if(result.rows.length === 0) throw new Error('Failed to delete robot');
        res.status(200).json({message: 'Robot successfully deleted'}); // send a success message back to the client
    } 
    catch(err) {
        console.error(`Error in deleteRobot: ${err.message}`);
        res.status(500).send(err.message);
    } 
    finally {
        client.release();
    }
}

module.exports = {
    getRobot,
    createRobot,
    updateRobot,
    deleteRobot
}