const pool = require('../../services/postGreSQL');
const {
    getUsersInGroupQuery,
    createGroupUserQuery,
    updateGroupUserQuery,
    deleteGroupUserQuery,
    checkGroupSpaceQuery,
    checkUserGroupQuery,
    deleteGroupInfoQuery,
    deleteAllGroupsInfoQuery
} = require('./../../services/queries/queriesGroupInfo');

const {
    getIndividualGroupQuery
} = require('./../../services/queries/queryGroups');


const getUsersInGroup = async (client, group_id) => {
    // console.log(group_id)
    const values = [group_id];

    try {
        const { rows } = await client.query(getUsersInGroupQuery, values);
        return { count: rows[0].count, status: 200 };
    } 
    catch (error) {
        console.error(error);
        return { error: 'Server error', status: 500 }
    } 
};

const createGroupUser = async (req, res) => {
    const { user_id, group_id, class_id } = req.body; // add a class_id here aswell
    const values = [user_id, group_id, class_id];
    const client = await pool.connect();
    let currentCount = 0;

    console.log(values)
    console.log(user_id)

    try {
        // check if user is already in a group
        console.log('Executing checkUserGroupQuery');
        const checkResult = await client.query(checkUserGroupQuery, [user_id]);
        console.log('check', checkResult)

        if (checkResult.rowCount > 0) {
            console.log('Executing deleteGroupUserQuery');
            await client.query(deleteGroupUserQuery, [user_id]);
        }

        // check if group is full
        console.log('Executing checkGroupSpaceQuery');
        const groupSpaceResult = await client.query(checkGroupSpaceQuery, [group_id]);

        if (groupSpaceResult.rowCount === 0) {
            console.log('No users in group yet')
        } 
        else {
            currentCount = groupSpaceResult.rows[0].count;
        }

        //get max count of group
        console.log('Executing getIndividualGroupQuery');
        const groupResult = await client.query(getIndividualGroupQuery, [group_id]);
        const maxCount = groupResult.rows[0].max_count;

        if (currentCount >= maxCount) {
            return res.status(400).json({ error: 'The selected group is already full.' });
        }

        // create group user
        console.log('Executing createGroupUserQuery');
        const { rows } = await client.query(createGroupUserQuery, values);
        return res.status(200).json(rows[0]);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
    finally {
        client.release();
    }
};



const updateGroupUser = async (req, res) => {
    const user_id = req.params.id;
    const { group_id } = req.body;
    const values = [user_id, group_id];
    const client = await pool.connect();

    try {
        const { rows } = await client.query(updateGroupUserQuery, values);
        return res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    } finally {
        client.release();
    }
};

const deleteGroupUser = async (req, res) => {
    const user_id = req.params.id;
    const values = [user_id];
    const client = await pool.connect();

    console.log(values)
    try {
        const { rows } = await client.query(deleteGroupUserQuery, values);
        if (rows.length === 0) {
            console.log('group user not found')
            return res.status(404).json({ message: `user with id ${user_id} not found` });
        } 
        else {
            console.log('deleted user from group_users');
            return res.status(200).json(rows);
        }
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    } 
    finally {
        client.release();
    }
};

const deleteGroupInfo = async (req, res) => {
    const group_id = req.params.id; //delete class_id such that all groups with the same class are deleted when the class is deleted
    const values = [group_id];
    const client = await pool.connect();

    console.log('group_info', values)
    try {
        const { rows } = await client.query(deleteGroupInfoQuery, values);
        if (rows.length === 0) {
            console.log('group info not found')
            return res.status(404).json({ message: `group with id ${group_id} not found` });
        } 
        else {
            console.log('deleted group from group_users');
            return res.status(200).json(rows);
        }
    } 
    catch (error) {
        console.log('failed to delete group')
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    } 
    finally {
        client.release();
    }
};

const deleteAllGroupsInfo = async (req, res) => {
    const class_id = req.params.id; //delete class_id such that all groups with the same class are deleted when the class is deleted
    const values = [class_id];
    const client = await pool.connect();

    console.log(values)
    try {
        const { rows } = await client.query(deleteAllGroupsInfoQuery, values);
        if (rows.length === 0) {
            console.log('no group found for all groups info')
            return res.status(404).json({ message: `groups with class id ${class_id} not found` });
        } 
        else {
            console.log('deleted groups from group_users');
            return res.status(200).json(rows);
        }
    } 
    catch (error) {
        console.log('failed to delete all group info')
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    } 
    finally {
        client.release();
    }
};


module.exports = {
    getUsersInGroup,
    createGroupUser,
    updateGroupUser,
    deleteGroupUser,
    deleteGroupInfo,
    deleteAllGroupsInfo
};
