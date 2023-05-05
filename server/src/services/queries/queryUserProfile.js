

const getAllUserProfilesQuery = `
    SELECT * FROM user_profile
`;

const getUserByIdQuery = `
    SELECT * FROM user_profile WHERE id = $1
`; //$1 is a variable that is passed into the query -> [id]

const checkEmailExists = `
    SELECT * FROM user_profile WHERE email = $1
`;//Variable -> [email]


const addUserQuery = `
    INSERT INTO user_profile (username, password, email, name, lastname, dob, school_name, school_id, user_role, class_id, class_name, group_id, group_name ) 
    VALUES ($1, crypt($2, gen_salt('bf')) , $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *
`;

const deleteUserQuery = `
    DELETE FROM user_profile WHERE id=$1 RETURNING *
`;

const updateUserQuery = `
    UPDATE user_profile SET 
    email=$1, 
    password=$2, 
    username=$3, 
    name=$4, 
    lastname=$5, 
    dob=$6, 
    school_name=$7, 
    school_id=$8, 
    user_role=$9,
    class_id=$10,
    class_name=$11,
    group_id=$12,
    group_name=$13 
    WHERE id=$14
    RETURNING *
`;

const authenticateUserQuery = `
    SELECT * FROM 
    user_profile
    WHERE email = $1 
`

const createAdminAccountQuery = `
    INSERT INTO admins (email, password, user_role)
    VALUES ($1, crypt($2, gen_salt('bf')), $3)
    RETURNING *`;


const checkAdminEmailExists = `
    SELECT * FROM admins WHERE email = $1
`;

const authenticateAdminQuery = `
    SELECT * FROM 
    admins
    WHERE email = $1 
`
const getAllAdminProfilesQuery = `
    SELECT * FROM admins
    `;

const getAdminProfilesByIdQuery = `
    SELECT * FROM admins WHERE id = $1
    `;

const updateClassIDForClassQuery = `
    UPDATE user_profile SET
    group_id = NULL,
    group_name = NULL,
    class_id = NULL,
    class_name = NULL
    WHERE class_id = $1
    RETURNING *
`;


const updateGroupIDForUserQuery = `
    UPDATE user_profile SET
    group_id = NULL,
    group_name = NULL
    WHERE group_id = $1
    RETURNING *
`;


const getUsersInGroupQuery = `
    SELECT * FROM user_profile
    WHERE group_id = $1;
    `;

module.exports = {
    getAllUserProfilesQuery,
    getUserByIdQuery,
    checkEmailExists,
    addUserQuery,
    deleteUserQuery,
    updateUserQuery,
    authenticateUserQuery,
    createAdminAccountQuery,
    checkAdminEmailExists,
    authenticateAdminQuery,
    getAllAdminProfilesQuery,
    getAdminProfilesByIdQuery,
    updateGroupIDForUserQuery,
    updateClassIDForClassQuery,
    getUsersInGroupQuery
}