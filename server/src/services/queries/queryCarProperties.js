// const checkIfCarDetailsExists = `
//     SELECT * FROM cars WHERE user_profile_id = $1;
//     `

const checkIfCarDetailsExists = `
    SELECT COUNT(*) FROM cars WHERE user_profile_id = $1;
`;

const getAllCarDetailsQuery = `
    SELECT * FROM cars     
    `;

const getUserCarDetailsQuery = `
    SELECT c.id, C.money, c.speed, c.acceleration, c.wheels, c.handling, c.user_profile_id, c.upgrade_log FROM cars c 
    INNER JOIN user_profile u ON c.user_profile_id = u.id
    WHERE u.id = $1;
`;

const createCarDetailsQuery = `
    INSERT INTO cars (user_profile_id) 
    VALUES ($1)
    RETURNING *;
    `;

const updateCarDetailsQuery = `
    UPDATE cars SET 
    speed = $1, 
    acceleration = $2, 
    wheels = $3, 
    handling = $4, 
    money = $5,
    upgrade_log = $6::jsonb,
    user_profile_id =$7
    WHERE user_profile_id = $7
    RETURNING *
    `;

const deleteCarDetailsQuery = `
    DELETE FROM cars WHERE user_profile_id=$1 
    RETURNING *
    `;

const deleteCarIdQuery = `
    DELETE FROM cars WHERE id=$1 
    RETURNING *
    `


module.exports = {
    checkIfCarDetailsExists,
    getAllCarDetailsQuery,
    getUserCarDetailsQuery,
    createCarDetailsQuery,
    updateCarDetailsQuery,
    deleteCarDetailsQuery,
    deleteCarIdQuery
}