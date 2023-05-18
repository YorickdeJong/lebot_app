const pool = require('../../services/postGreSQL')

const {
    getSpecificSchoolQuery,
    getAllSchoolsQuery,
    createSchoolQuery,
    updateSchoolQuery,
    deleteSchoolByNameQuery,
    deleteSchoolByIDQuery
} = require('./../../services/queries/querySchools')


const getSpecificSchool = async (req, res) => {
    const {school_id, lesson_number, class_id} = req.query;
    const values = [school_id, lesson_number, class_id];
    const client = await pool.connect();

    try {
        const { rows } = await client.query(getSpecificSchoolQuery, values);

        if (rows.length === 0){
            return res.status(404).json({message: 'School does not exist'});
        }
        else {
            console.log(rows)
            return res.status(200).json(rows)
        }
    }
    catch (error){
        console.log(error);
        return res.status(500).json({error: 'Failed to get school'});
    }

    finally {
        client.release();
    }    
}


const getAllSchools = async (req, res) => {
    const client = await pool.connect();
    
    try {
        const { rows } = await client.query(getAllSchoolsQuery);
        console.log(rows)
        if (rows.length === 0){
            return res.status(404).json({message: 'No schools found'});
        }
        else {
            console.log(rows)
            return res.status(200).json(rows)
        }
        
    }
    catch (error){
        console.log(error);
        return res.status(500).json({error: 'Failed to get all schools'});
    }
    
    finally {
        client.release();
    }
}


const createSchool = async (req, res) => {
    const {school_name} = req.body
    
    console.log(school_name)
    const values = [school_name];
    const client = await pool.connect();

        
    try {
        const {rows} = await client.query(getSpecificSchoolQuery, [school_name]);
        console.log(`rows: ${rows.length}`);
        if (rows.length > 0){
            console.log('school exists')
            return res.status(404).json({message: `school with name ${school_name} already exists`});
        }
    }
    catch (error){
        return res.status(500).json({ message: error.message });
    }   

    try {
        const {rows} = await client.query(createSchoolQuery, values);
        console.log(rows)
        console.log('successfully added school')
        return res.status(200).json(rows);
    }
    catch (error){
        console.log(error);
        return res.status(500).json({error: 'Failed to get school status'});
    }
    
    finally {
        client.release();
    }
}


const updateSchool = async (req, res) => { //Could be used for users that want to add their own assignment
    const client = await pool.connect();
    const school_id = req.params.id;
    
    try {
        const school_name = req.body.school_name;
        const values = [school_name, school_id];
        const {rows} = await client.query(updateSchoolQuery, values);

        if (rows.length === 0){
            return res.status(404).json({message: `School with id ${school_id} not found`})
        }
        else {
            console.log(rows);
            return res.status(200).json(`Succesfully update school to ${school_name}§`)
        }
    }
    catch (error){
        console.log(error)
        return res.status(500).json({error: `Failed to update school with name ${school_name}`});
    }

    finally {
        client.release();
    }    
}


const deleteSchoolByName = async (req, res) => {
    const school_name = req.params.school_name;

    const values = [school_name];
    const client = await pool.connect();

    try {
        const {rows} = await client.query(deleteSchoolByNameQuery, values);

        if (rows.length === 0){
            return res.status(404).json({message: `School with name ${school_name} not found`});
        }
        else {
            console.log('delted school');
            return res.status(200).json(rows);
        }
    }
    catch (error){
        console.log(error);
        return res.status(500).json({error: 'Failed to delete school'});
    }
    
    finally {
        client.release();
    }    
}


const deleteSchoolByID = async (req, res) => {
    const school_id = req.params.id;

    const values = [school_id];
    const client = await pool.connect();

    try {
        const {rows} = await client.query(deleteSchoolByIDQuery, values);

        if (rows.length === 0){
            return res.status(404).json({message: `School with id ${school_id} not found`});
        }
        else {
            console.log('delted school');
            return res.status(200).json(rows);
        }
    }
    catch (error){
        console.log(error);
        return res.status(500).json({error: 'Failed to delete school'});
    }
    
    finally {
        client.release();
    }    
}



module.exports = {
    getSpecificSchool,
    getAllSchools,
    updateSchool,
    createSchool,
    deleteSchoolByName,
    deleteSchoolByID
}