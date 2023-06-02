const pool = require('../../services/postGreSQL')
const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; 
const iv = crypto.randomBytes(16);

// Use a constant key instead of generating a new one every time
const key = process.env.ENCRYPTION_KEY

// Encrypts text 
function encrypt(text) {
    let iv = crypto.randomBytes(16); // Generate a new IV every time we encrypt
    let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return JSON.stringify({ iv: iv.toString('base64'), encryptedData: encrypted.toString('base64') });
}

// Decrypts text
function decrypt(text) {
    let iv = Buffer.from(text.iv, 'base64'); // Use the IV that was stored with the encrypted data
    let encryptedText = Buffer.from(text.encryptedData, 'base64');
    let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}


const getRobot = async (req, res) => {
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT * FROM robots');
        if(rows.length === 0) throw new Error('Robot does not exist');
        console.log('rows', rows)
        // Decrypt the passwords
        rows.forEach(row => {
            if(row.password) {
                const passwordObject = JSON.parse(row.password); // parse the password string into an object
                const decryptedPassword = decrypt(passwordObject);
                row.password = decryptedPassword;
            }
        });
        
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

const getRobotByGroupIdClassId = async (req, res) => {
    const client = await pool.connect();
    try {
        const  { school_id, group_id, class_id }  = req.query;
        console.log('school_id', school_id, 'group_id', group_id, 'class_id', class_id)
        let rows;

        // First, try to find an existing robot for this group
        ({ rows } = await client.query('SELECT * FROM robots WHERE school_id = $1 AND group_id = $2 AND class_id = $3', [school_id, group_id, class_id]));
        if(rows.length > 0) {
            const row = rows[0];
            const passwordObject = JSON.parse(row.password);
            const decryptedPassword = decrypt(passwordObject);
            row.password = decryptedPassword;
            res.status(200).json(row);
            return;
        }

        // If no robot exists for this group, assign an available one
        ({ rows } = await client.query('SELECT * FROM robots WHERE group_id IS NULL AND class_id IS NULL AND school_id=$1 ORDER BY id ASC LIMIT 1', [school_id]));
        if(rows.length === 0) throw new Error('No available robot for this group and class');

        const row = rows[0];  
        await client.query('UPDATE robots SET group_id = $1, class_id = $2 WHERE id = $3', [group_id, class_id, row.id]);


        const passwordObject = JSON.parse(row.password);
        const decryptedPassword = decrypt(passwordObject);
        row.password = decryptedPassword;
        
        res.status(200).json(row);
    }
    catch(err) {
        console.error(`Error in getRobotByGroupIdClassId: ${err.message}`);
        res.status(500).send(err.message);
    }
    finally {
        client.release();
    }
}



const createRobots = async (req, res) =>  {
    const client = await pool.connect();
    const startId = parseInt(req.body.startId, 10);  // convert the starting robot id to an integer
    const endId = parseInt(req.body.endId, 10);
    const numRobots = endId - startId + 1;
    const createdRobots = [];  // to store the created robots

    try {
        for(let i = 0; i < numRobots; i++) {
            const robotId = `robot-${startId + i}`;
            // Generate a random password
            const plainPassword = Math.random().toString(36).slice(-10); // Creates a random 10 character string
            const encryptedPassword = encrypt(plainPassword);
            const result = await client.query('INSERT INTO robots (robot_id, password) VALUES ($1, $2) RETURNING *', [robotId, encryptedPassword]);
            if(result.rows.length === 0) throw new Error(`Failed to create robot ${robotId}`);
            createdRobots.push(result.rows[0]); // add the created robot to the array
        }
        res.status(200).json(createdRobots); // send all created robots back to the client at once
    } 
    catch(err) {
        console.error(`Error in createRobots: ${err.message}`);
        res.status(500).send(err.message);
    } 
    finally {
        client.release();
    }
}

const updateRobot = async (req, res) => {
    const client = await pool.connect();
    const id = req.params.id;  // or however you receive the robot id in the request
    const plainPassword = req.body.password; // assuming you receive the password in the request body
    try {
        const encryptedPassword = encrypt(plainPassword);
        const result = await client.query('UPDATE robots SET password = $1 WHERE id = $2 RETURNING *', [encryptedPassword, id]);
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

const deleteRobots = async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('DELETE FROM robots RETURNING *');
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

const assignSchoolToRobots = async (req, res) => {
    const { schoolId, startRobotId, endRobotId } = req.body;
    console.log('schoolId', schoolId)
    console.log('startRobotId', startRobotId)
    console.log('endRobotId', endRobotId)
    const client = await pool.connect();
  
    try {
        await client.query('BEGIN');
        const updateQuery = 'UPDATE robots SET school_id = $1 WHERE robot_id BETWEEN $2 AND $3';
        await client.query(updateQuery, [schoolId, startRobotId, endRobotId]);
        await client.query('COMMIT');
        console.log('added school_id to robots')
        res.status(200).send('Successfully updated robots');
    } 
    catch (error) {
        await client.query('ROLLBACK');
        res.status(500).send('An error occurred while updating robots');
    } 
    finally {
      client.release();
    }
};

module.exports = {
    getRobot,
    getRobotByGroupIdClassId,
    createRobots,
    updateRobot,
    deleteRobot,
    deleteRobots,
    assignSchoolToRobots
}