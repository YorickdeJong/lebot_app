const pool = require('../../services/postGreSQL')
const {
    checkIfCarDetailsExists,
    getAllCarDetailsQuery,
    getUserCarDetailsQuery,
    createCarDetailsQuery,
    updateCarDetailsQuery,
    deleteCarDetailsQuery,
    deleteCarIdQuery
} = require('./../../services/queries/queryCarProperties')


const getAllCarDetails = async (req, res) => {
    const client = await pool.connect();

    try {
        const {rows} = await client.query(getAllCarDetailsQuery);
        if (rows.length === 0) {
            return res.status(404).json('Car detail not found')
        }
        else {
            console.log(rows);
            return res.status(200).json(rows)
        }
    }
    catch (error){
        console.log(error);
        return res.status(500).json({error: 'Failed to get car detail'})
    }       

    finally {
        client.release();
    }    
}

//gets assignment with id
const getCarDetails = async (req, res) => {
    const client = await pool.connect();

    try {
        const user_profile_id = req.params.id;  

        const {rows} = await client.query(getUserCarDetailsQuery, [user_profile_id]);
        console.log(user_profile_id)
        if (rows.length === 0) {
            return res.status(404).json('Car detail not found')
        }
        else {
            console.log(rows);
            return res.status(200).json(rows)
        }
    }
    catch (error){
        console.log(error);
        return res.status(500).json({error: 'Failed to get car detail'})
    }       

    finally {
        client.release();
    }    
}

const createCarDetails = async (req, res) => {
    const client = await pool.connect();
        const {user_profile_id} = req.body

    try {
        const {rows} = await client.query(checkIfCarDetailsExists, [user_profile_id]);

        if (rows[0].count > 0){
            return res.status(400).json({message: `Car details with for user_id  ${user_profile_id} already exists`})
        }
    }
    catch (error){
        console.log(error)
        return res.status(500).json({error: 'Failed to check if car details exitst'})
    }

    try {
        const result = await client.query(createCarDetailsQuery, [user_profile_id]);
        return res.status(200).json('Succesfully added car details')
    }
    catch (error){
        console.log(error);
        return res.status(500).json({error: "Failed to create car details"})
    }   

    finally {
        client.release();
    }    
}

const updateCarDetails = async (req, res) => { //Could be used for users that want to add their own assignment
    const client = await pool.connect();
    
    try {
        const user_profile_id = req.params.id;
        const {speed, acceleration, wheels, handling, money, upgrade_log} = req.body;
        console.log(req.body)
        const values = [speed, acceleration, wheels, handling, money, upgrade_log, user_profile_id];
        console.log(values)
        const {rows} = await client.query(updateCarDetailsQuery, values);
        if (rows.length === 0){
            return res.status(404).json({message: `Car details with id ${user_profile_id} not found`})
        }
        else {
            console.log(rows);
            return res.status(200).json('Succesfully update car details')
        }
    }
    catch (error){
        console.log(error)
        return res.status(500).json({error: 'Failed to update car details'});
    }

    finally {
        client.release();
    }    
}


const deleteCarDetails = async (req, res) => {
    const client = await pool.connect();

    try {
        const user_id = req.params.id;
        const {rows} = await client.query(deleteCarDetailsQuery, [user_id]);

        if (rows.length === 0){
            return res.status(404).json({message: `Car details with id ${user_id} not found`})
        }
        else {
            console.log(rows);
            return res.status(200).json('Succesfully deleted car details')
        }
    }
    catch (error){
        console.log(error);
        return res.status(500).json({error: 'Failed to delete car details'});
    }
    
    finally {
        client.release();
    }    
}


const deleteCarId = async (req, res) => {
    const client = await pool.connect();

    try {
        const id = req.params.id;
        const {rows} = await client.query(deleteCarIdQuery, [id]);

        if (rows.length === 0){
            return res.status(404).json({message: `Car details with id ${id} not found`})
        }
        else {
            console.log(rows);
            return res.status(200).json('Succesfully deleted car details')
        }
    }
    catch (error){
        console.log(error);
        return res.status(500).json({error: 'Failed to delete car details'});
    }
    
    finally {
        client.release();
    }    
}


module.exports = {
    getCarDetails,
    getAllCarDetails,
    createCarDetails,
    updateCarDetails,
    deleteCarDetails,
    deleteCarId
}