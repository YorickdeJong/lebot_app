const pool = require('../../services/postGreSQL')
const jwt = require('jsonwebtoken')
const secret = "secret-key"; // your secret key for signing the JWT

const {    
    getAllUserProfilesQuery,
    getUserByIdQuery,
    addUserQuery,
    deleteUserQuery,
    checkEmailExists,
    updateUserQuery,
    createAdminAccountQuery,
    checkAdminEmailExists,
    getAllAdminProfilesQuery,
    getAdminProfilesByIdQuery,
    updateGroupIDForUserQuery,
    updateClassIDForClassQuery,
    getUsersInGroupQuery
 } = require('../../services/queries/queryUserProfile');
const { createKeyQuery } = require('../../services/queries/queryKeys');



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

const getAllAdminProfiles = async (req, res) => {

    const client = await pool.connect();
    try {
        const { rows } = await client.query(getAllAdminProfilesQuery);
        console.log(rows)
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



// Function to retrieve a user profile from the database by its ID
const getAdminProfileById = async (req, res) => {
    const id = req.params.id;   
    const client = await pool.connect();

    try {
        const { rows } = await client.query(getAdminProfilesByIdQuery, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Admin not found' });
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

const getUsersInGroup = async (client, group_id) => {
    console.log('group_id', group_id)
    const values = [group_id];

    try {
        const { rows } = await client.query(getUsersInGroupQuery, values);

        if (rows.length === 0) {
            console.log('users not found')
            return {data: null, status: 404};
        }
        else {
            console.log('users found', rows)
            return {data: rows, status: 200};
        }
    } 
    catch (error) {
        console.log('error getting users', error)
        return {data: null, status: 500};
    }

}

// Function to create a new user profile in the database
const createUserProfile = async (req, res) => {
    
    // Get params and connect to database
    const { email, password, username, name, lastname, dob, school_name, school_id, user_role, class_id, class_name, group_id, group_name } = req.body;
    
    // list that will be added to db
    const values = [username, password, email, name, lastname, dob, school_name, school_id, user_role, class_id, class_name, group_id, group_name];
    
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

const createAdminAccount = async (req, res) => {
    // Get params and connect to database
    const { email, password } = req.body;
    const user_role = 'admin'; // Set user_role to 'admin'
    
    console.log(email + ' ' + password)
    const client = await pool.connect();

    // Check if account already exists in database
    try {
        const { rows } = await client.query(checkAdminEmailExists, [email]);
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
        const values = [email, password, user_role];

        // Modify the addUserQuery to only include email, password, and user_role
        // Make sure the query matches the new set of values
        const result = await client.query(createAdminAccountQuery, values);
        const createdAdminProfile = result.rows[0];
        const token = generateToken(createdAdminProfile.id);
        const id = createdAdminProfile.id

        // check if all went well
        await client.query('COMMIT');
        console.log('succesfully created admin account')

        return res.status(200).json({ 
            message: 'Admin account created',
            token,
            id
        });
    } 
    catch (error) {
        // print error message if error occured
        await client.query('ROLLBACK');
        console.log(error)
        return res.status(500).json({error: 'Failed to add admin'})
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
        const { email, password, username, name, lastname, dob, school_name, school_id, user_role, class_id, class_name, group_id, group_name} = req.body;
        const values = [email, password, username, name, lastname, dob, school_name, school_id, user_role, class_id, class_name, group_id, group_name, id]
        
        console.log('values', values)
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
        console.log(error)
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

// UPDATE group_id to NULL for all users in a certain class
const updateGroupIDForClass = async (req, res) => {
    const class_id = req.params.id;
    const client = await pool.connect();

        console.log('GROUPIDFORCLASS', class_id)
    try {
        const result = await client.query(updateClassIDForClassQuery, [class_id]);
        const updatedUsers = result.rows;
        console.log('UPDATED USERS', updatedUsers)

        if (updatedUsers.length === 0) {
            console.log('No users found in the specified class, could not update group_id')
            return res.status(404).json({ error: `No users found in class with ID ${class_id}` });
        } else {
            console.log('Updated group_id to NULL for all users in the specified class');
            return res.status(200).json(updatedUsers);
        }
    } 
    catch (error) {
        console.log('Failed to update group_id for users in the specified class');
        console.log(error)
        return res.status(500).json({ error: error.message });
    } 
    finally {
        client.release();
    }
};


// UPDATE group_id to NULL for all users in a certain group
const updateGroupIDForUsers = async (req, res) => {
    const group_id = req.params.id;
    console.log('GROUP ID', group_id)
    const client = await pool.connect();
    console.log('GROUPIDFORUSERS', group_id)
    try {
        const result = await client.query(updateGroupIDForUserQuery, [group_id]);
        const updatedUsers = result.rows;

        if (updatedUsers.length === 0) {
            console.log('No users found in the specified group, could not update group_id')
            return res.status(404).json({ error: `No users found in group with ID ${group_id}` });
        } else {
            console.log('Updated group_id to NULL for all users in the specified group');
            return res.status(200).json(updatedUsers);
        }
    } 
    catch (error) {
        console.log('Failed to update group_id for users in the specified group');
        return res.status(500).json({ error: error.message });
    } 
    finally {
        client.release();
    }
};

// Function to verify JWT
function verifyToken(token) {
    return jwt.verify(token, secret);
}

//add that group / classes get deleted from userprofile when deleted from group / class table

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
    createAdminAccount,
    getAllUserProfiles,
    getAllAdminProfiles,
    getUserProfileById,
    getAdminProfileById,
    createUserProfile,
    deleteUser,
    updateUser,
    updateGroupIDForClass,
    updateGroupIDForUsers,
    getUsersInGroup
}