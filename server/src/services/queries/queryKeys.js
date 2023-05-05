
const getSpecificKeyQuery = `
    SELECT * FROM access_keys WHERE uuid_key = $1;
    `;

const getAllKeysForSchoolQuery = `
    SELECT * FROM access_keys WHERE school_name = $1;
    `;


const createKeyQuery = `
    INSERT INTO access_keys (uuid_key, school_id, school_name, user_role)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
`;

const updateKeyQuery = `
    UPDATE access_keys
    SET user_role = $1
    WHERE uuid_key = $2;
    RETURNING *
    `;

const deleteAllSchoolKeyQuery = `
    DELETE FROM access_keys WHERE school_name = $1 RETURNING *;
    `;

const deleteSpecificKeyQuery = `
    DELETE FROM access_keys WHERE uuid_key = $1 RETURNING *
    `;

module.exports = {
    getSpecificKeyQuery,
    getAllKeysForSchoolQuery,
    createKeyQuery,
    updateKeyQuery,
    deleteAllSchoolKeyQuery,
    deleteSpecificKeyQuery
  }