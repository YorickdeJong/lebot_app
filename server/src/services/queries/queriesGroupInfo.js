const getUsersInGroupQuery = `
    SELECT COUNT(*) FROM group_users
    WHERE group_id = $1;
`;

const createGroupUserQuery = `
    INSERT INTO group_users (user_id, group_id, class_id)
    VALUES ($1, $2, $3)
    RETURNING *;
`;

const updateGroupUserQuery = `
    UPDATE group_users
    SET group_id = $2
    WHERE user_id = $1
    RETURNING *;
`;

const deleteGroupUserQuery = `
    DELETE FROM group_users
    WHERE user_id = $1
    RETURNING *;
`;

const checkGroupSpaceQuery = `
    SELECT COUNT(*) as count, max_count 
    FROM group_users INNER JOIN groups 
    ON group_users.group_id = groups.group_id 
    WHERE group_users.group_id = $1 
    GROUP BY groups.group_id
    `;

const checkUserGroupQuery = `
    SELECT group_id 
    FROM group_users 
    WHERE user_id = $1
    ;`


const deleteGroupInfoQuery = `
    DELETE FROM group_users
    WHERE group_id = $1
    RETURNING *;
`;

const deleteAllGroupsInfoQuery = `
    DELETE FROM group_users
    WHERE class_id = $1
    RETURNING *;
`;


module.exports = {
    getUsersInGroupQuery,
    createGroupUserQuery,
    updateGroupUserQuery,
    deleteGroupUserQuery,
    checkGroupSpaceQuery,
    checkUserGroupQuery,
    deleteGroupInfoQuery,
    deleteAllGroupsInfoQuery
};