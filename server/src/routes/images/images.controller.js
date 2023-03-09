const pool = require('../../services/postGreSQL')

const {
    getAllimagesQuery,
    getImageQuery,
    createImageQuery,
    deleteImageQuery,
} = require('./../../services/queries/queryImage')


const getAllUserImage = async (req, res) => {
    //supply both user_id and assignment_id
    const client = await pool.connect();

    try {
        const user_profile_id = parseInt(req.query.user_profile_id);
        const {rows} = await client.query(getAllimagesQuery, [user_profile_id]);
        console.log(rows);
        console.log(user_profile_id);

        if (rows.length === 0) {
            return res.status(400).json({error: 'No images found'})
        }
        else {
            return res.status(200).json(rows)
        }
    } 
    catch (error){
        console.log(error)
        return res.status(500).json({error: 'Error trying to get image data'})
    }

    finally {
        client.release(); 
    }
}

const getUserImage = async (req, res) => {
    //supply both user_id and assignment_id
    const client = await pool.connect();

    try {
        const user_profile_id = parseInt(req.query.user_profile_id);
        const assignment_number = parseInt(req.query.assignment_number);
        const {rows} = await client.query(getImageQuery, [assignment_number,user_profile_id]);
        console.log(rows);
        console.log(user_profile_id + " " + assignment_number);

        if (rows.length === 0) {
            return res.status(400).json({error: 'Images for specific assignment do not exits'})
        }
        else {
            io.emit('images', rows);
            return res.status(200).json(rows)
        }
    } 
    catch (error){
        console.log(error)
        return res.status(500).json({error: 'Error trying to get image data'})
    }

    finally {
        client.release(); 
    }
}

const createUserImage = async (req, res) => {
    const {name, data, mime_type, size, assignment_number, user_profile_id, title} = req.body;
    const client = await pool.connect();

    try {
        const values = [name, data, mime_type, size, assignment_number, user_profile_id, title]
        const {rows} = await client.query(createImageQuery, values)
        console.log(rows)
        return res.status(200).json({message: 'added image to database'})
    }
    catch (error){
        console.log(error)
        return res.status(500, {
            error: 'Failed to add the image to the database'
        });
    }

    finally {
        client.release(); 
    }
}

const deleteUserImage = async (req, res) => {
    const client = await pool.connect();

    try {
        const image_id = req.params.id;
        const {rows} = await client.query(deleteImageQuery, [image_id]);
        
        if (rows.length === 0){
            return res.status(404).json({error: `Image with ID ${image_id} was not found`})
        }
        else {
            console.log('Deleted image')
            return res.status(200).json('Succesfully deleted Image');
        }
    }
    catch (error){
        console.log(error)
        return res.status(500).json({error: 'Failed to delete Image'});
    }

    finally {
        client.release(); 
    }
}

module.exports = {
    getAllUserImage,
    getUserImage,
    createUserImage,
    deleteUserImage
}