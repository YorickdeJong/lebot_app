const getIndividualClassQuery = `
    SELECT * FROM classes
    WHERE class_id = $1;
`;

const getAllClassesQuery = `
    SELECT * FROM classes
`;


const getClassesPerSchoolQuery = `
    SELECT * FROM classes
    WHERE school_id = $1;
`;

const checkIfClassForSchoolExistsQuery = `
    SELECT * FROM classes
    WHERE school_id = $1 AND name = $2;
`;

const createClassQuery = `
    INSERT INTO classes (name, school_id, max_count)
    VALUES ($1, $2, $3)
    RETURNING *;
`;

const updateClassQuery = `
    UPDATE classes
    SET name = $1, max_count = $2, school_id = $3
    WHERE class_id = $4
    RETURNING *;
`;

const deleteClassQuery = `
    DELETE FROM classes
    WHERE class_id = $1
    RETURNING *;
`;

module.exports = {
    getIndividualClassQuery,
    getClassesPerSchoolQuery,
    checkIfClassForSchoolExistsQuery,
    createClassQuery,
    updateClassQuery,
    deleteClassQuery,
    getAllClassesQuery
};