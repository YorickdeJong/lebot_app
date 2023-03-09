const pool = require('../../services/postGreSQL')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const secret = "secret-key"; // your secret key for signing the JWT

const {    
    getAllUserProfilesQuery,
    getUserByIdQuery,
    addUserQuery,
    deleteUserQuery,
    checkEmailExists,
    updateUserQuery,
 } = require('../../services/queries/queryUserProfile')



const getAllUserProfiles = async (req, res) => {

    const client = await pool.connect();
    try {
        const { rows } = await client.query(getAllUserProfilesQuery);
        return res.status(200).json(rows);
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }

    finally {
        client.release(); 
    }
}


// Function to retrieve a user profile from the database by its ID
const getUserProfileById = async (req, res) => {
    const id = req.params.id;   
    const client = await pool.connect();

    try {
        const { rows } = await client.query(getUserByIdQuery, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        else {
            res.status(200).json(rows[0]);
        }
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    }

    finally {
        client.release();
    }
}

// Function to create a new user profile in the database
const createUserProfile = async (req, res) => {

    // Get params and connect to database
    const { email, password, username,  name, lastname, dob, school, classschool, level } = req.body;
    console.log(email)
    const client = await pool.connect();

    // Check if account already exists in database
    try {
        const { rows } = await client.query(checkEmailExists, [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }
    } 
    catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Error checking if account already exists.' });
    }


    // Function to generate JWT
    function generateToken(userId) {
        return jwt.sign({ userId }, secret, { expiresIn: "7d" });
    }


    
    try {
        await client.query('BEGIN');
        
        // list that will be added to db
        const values = [username, password, email, name, lastname, dob, school, classschool, level];

        // adding to db
        const result = await client.query(addUserQuery, values);
        const createdUserProfile = result.rows[0];
        const token = generateToken(createdUserProfile.id);
        const id = createdUserProfile.id

        // check if all went well
        await client.query('COMMIT');
        console.log('succesfully created account')

        return res.status(200).json({ 
            message: 'User authenticated',
            token,
            id
        });
        

    } 
    
    catch (error) {
        // print error message if error occured
        await client.query('ROLLBACK');
        // res.status(500).json(error);
        console.log(error)
        return res.status(500).json({error: 'Failed to add user'})
    } 
    
    finally {
        client.release();
    }
}

// UPDATE an existing user
const updateUser = async(req, res)  => {
    const client = await pool.connect();
    
    try {
        const id = req.params.id; 
        const { email, password, username, name, lastname, dob, school, classschool, level} = req.body;
        const values = [email, password, username, name, lastname, dob, school, classschool, level, id]
        
        const result = await client.query(updateUserQuery, values);
        const updatedUser = result.rows[0];

        if (!updatedUser) {
            console.log('Account not found')
            return res.status(404).json({ error: `User with ID ${id} not found` });
        } 
        else {
            console.log('succesfully updated account')
            console.log(updatedUser)
            return res.status(200).json(updatedUser);
        }
  } 

  catch (error) {
        console.log('failed to update user')
        return res.status(500).json({ error: error.message });
  }

  finally {
    client.release();
  }
}

// DELETE an existing user
const deleteUser = async (req, res) => {
    const id = req.params.id; 
    const client = await pool.connect();

    try {
        const result = await client.query(deleteUserQuery, [id]);
        const deletedUser = result.rows[0];

        if (!deletedUser) {
            console.log('user not found, could not delete')
            return res.status(404).json({ error: `User with ID ${id} not found` });
        }
        
        else {
            console.log('deleted user')
            return res.status(200).json(deletedUser);
            }
    } 
    
    catch (error) {
        console.log('failed to delete user')
        return res.status(500).json({ error: error.message });
    }

    finally {
        client.release();
    }
}

// Function to verify JWT
function verifyToken(token) {
    return jwt.verify(token, secret);
}


// Middleware to verify JWT
function authenticate(req, res, next) {
  const token = req.headers.authorization;

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } 
  catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}



module.exports = {
    getAllUserProfiles,
    getUserProfileById,
    createUserProfile,
    deleteUser,
    updateUser,

}