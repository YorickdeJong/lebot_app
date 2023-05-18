const pool = require('../../services/postGreSQL')

const {
    getIndividualGroupQuery,
    getGroupsPerClassRoomQuery,
    getGroupsPerSchoolQuery,
    checkIfGroupForClassExistsQuery,
    createGroupQuery,
    updateGroupQuery,
    deleteGroupQuery,
    getAllGroupQuery,
    deleteGroupsinClassQuery
} = require('./../../services/queries/queryGroups')

const getGroupsPerClassRoom = async (client, class_id, school_id) => {
    console.log('class_id, school_id', class_id, school_id);
    console.log('client connected')
    const values = [class_id, school_id];

    try {
        const { rows } = await client.query(getGroupsPerClassRoomQuery, values);
        console.log(rows)
        if (rows.length === 0){
            console.log('no groups found')
            return {message: 'No groups found', status: 404}
        }
        else {
            console.log('rows', rows)
            return { data: rows, status: 200 };
        }
        
    }
    catch (error){
        console.log(error);
        return {error: 'Failed to get all groups', status: 500}
    }
    
}


const getGroupsPerClassRoomRequest = async (req, res) => {
    const client = await pool.connect();
    try {
        const { rows } = await client.query(getAllGroupQuery);
        console.log(rows)
        if (rows.length === 0){
            console.log('no groups found')
            return res.status(404).json({message: 'No groups found'})
        }
        else {
            console.log('rows', rows)
            return res.status(200).json({ data: rows });
        }
        
    }
    catch (error){
        console.log(error);
        return res.status(500).json({message: 'Failed to get all groups'})
    }
    
    finally {
        console.log('released client groups per class')
        client.release();
    }
}

const getIndividualGroup = async (req, res) => {
    const group_id = req.params.id;
    const values = [group_id];
    const client = await pool.connect();

    try {
        const { rows } = await client.query(getIndividualGroupQuery, values);

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



const getGroupsPerSchool = async (req, res) => {
    const client = await pool.connect();
    const school_id = req.query.school_id;
    const values = [school_id];

    try {
        const { rows } = await client.query(getGroupsPerSchoolQuery, values);
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




const createGroup = async (req, res) => {
    const {name, class_id, school_id, max_count} = req.body
    
    console.log('name', name)
    const values = [name, class_id, school_id, max_count];
    const client = await pool.connect();

        
    try {
        const {rows} = await client.query(checkIfGroupForClassExistsQuery, [class_id, name]);
        console.log(`rows: ${rows.length}`);

        if (rows.length > 0){
            console.log('group exists')
            return res.status(404).json([{group_id: false}]);
        }
    }

    catch (error){
        return res.status(500).json({ message: error.message });
    }   

    try {
        const {rows} = await client.query(createGroupQuery, values);
        console.log(rows)
        console.log('successfully added group')
        return res.status(200).json(rows);
    }
    catch (error){
        console.log(error);
        return res.status(500).json({error: 'Failed to get group status'});
    }
    
    finally {
        client.release();
    }
}


const updateGroup = async (req, res) => { //Could be used for users that want to add their own assignment
    const client = await pool.connect();
    const group_id = req.params.id;
    
    try {
        const {name, max_count, school_id, class_id} = req.body
        const values = [name, max_count, class_id, school_id, group_id];

        console.log('values', values)
        const {rows} = await client.query(updateGroupQuery, values);
        if (rows.length === 0){
            return res.status(404).json({message: `group with id ${group_id} not found`})
        }
        else {
            console.log(rows);
            return res.status(200).json(`Succesfully updated group to ${name}§`)
        }
    }
    catch (error){
        console.log(error)
        return res.status(500).json({error: `Failed to update group with name ${name}`});
    }

    finally {
        client.release();
    }    
}


const deleteGroupByID = async (req, res) => {
    const group_id = req.params.id;

    const values = [group_id];
    const client = await pool.connect();
    console.log('group_id', group_id)

    try {
        
        const {rows} = await client.query(deleteGroupQuery, values);
        
        if (rows.length === 0){
            console.log('group ID not found')
            return res.status(404).json({message: `Group with id ${group_id} not found`});
        }
        else {
            console.log('deleted group');
            return res.status(200).json(rows);
        }
    }
    catch (error){
        console.log('failed to delete group by id')
        console.log(error);
        return res.status(500).json({error: 'Failed to delete group'});
    }
    
    finally {
        client.release();
    }    
}

const deleteGroupsInClass = async (req, res) => {
    const class_id = req.params.id;

    const values = [class_id];
    const client = await pool.connect();

    try {
        
        const {rows} = await client.query(deleteGroupsinClassQuery, values);
        
        if (rows.length === 0){
            console.log('group not found for class')
            return res.status(404).json({message: `Groups with class_id ${class_id} not found`});
        }
        else {
            console.log('deleted group');
            return res.status(200).json(rows);
        }
    }
    catch (error){
        console.log('failed to delete groups in class')
        console.log(error);
        return res.status(500).json({error: 'Failed to delete group'});
    }
    
    finally {
        client.release();
    }    
}



module.exports = {
    getIndividualGroup,
    getGroupsPerClassRoom,
    getGroupsPerSchool,
    createGroup,
    updateGroup,
    deleteGroupByID,
    getGroupsPerClassRoomRequest,
    deleteGroupsInClass
}