const getUsersInClassQuery = `
    SELECT COUNT(*) FROM classes_users
    WHERE class_id = $1;
`;

const createClassUserQuery = `
    INSERT INTO classes_users (user_id, class_id)
    VALUES ($1, $2)
    RETURNING *;
`;

const updateClassUserQuery = `
    UPDATE classes_users
    SET class_id = $2
    WHERE user_id = $1
    RETURNING *;
`;

const deleteClassUserQuery = `
    DELETE FROM classes_users
    WHERE user_id = $1
    RETURNING *;
`;


const checkClassSpaceQuery = `
    SELECT COUNT(*) as count, max_count 
    FROM classes_users INNER JOIN classes 
    ON classes_users.class_id = classes.class_id 
    WHERE classes_users.class_id = $1 
    GROUP BY classes.class_id
    `;

const checkUserClassQuery = `
    SELECT class_id 
    FROM classes_users 
    WHERE user_id = $1
    ;`;

const deleteClassInfoQuery = `
    DELETE FROM classes_users
    WHERE class_id = $1
    RETURNING *;
`;


module.exports = {
    getUsersInClassQuery,
    createClassUserQuery,
    updateClassUserQuery,
    deleteClassUserQuery,
    checkUserClassQuery,
    checkClassSpaceQuery,
    deleteClassInfoQuery
};