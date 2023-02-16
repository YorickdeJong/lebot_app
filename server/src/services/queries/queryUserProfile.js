

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
    INSERT INTO user_profile (username, password, email, name, lastname, dob, school, classschool, level) 
    VALUES ($1, crypt($2, gen_salt('bf')) , $3, $4, $5, $6, $7, $8, $9) RETURNING *
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
    school=$7, 
    classschool=$8, 
    level=$9 
    WHERE id=$10 
    RETURNING *
`;

const authenticateUserQuery = `
    SELECT * FROM 
    user_profile
    WHERE email = $1
`

module.exports = {
    getAllUserProfilesQuery,
    getUserByIdQuery,
    checkEmailExists,
    addUserQuery,
    deleteUserQuery,
    updateUserQuery,
    authenticateUserQuery
}