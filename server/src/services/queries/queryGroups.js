

const getIndividualGroupQuery = `
    SELECT * FROM groups
    WHERE group_id = $1;
    `;

const getAllGroupQuery = `
    SELECT * FROM groups
    `;

const getGroupsPerClassRoomQuery = `
    SELECT * FROM groups
    WHERE class_id = $1 AND school_id = $2;
    `;

const getGroupsPerSchoolQuery = `
    SELECT * FROM groups
    WHERE school_id = $1;
    `;

const checkIfGroupForClassExistsQuery = `
    SELECT * FROM groups
    WHERE class_id = $1 AND name = $2;
    `;

const createGroupQuery = `
    INSERT INTO groups (name, class_id, school_id, max_count)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `;

const updateGroupQuery = `
    UPDATE groups
    SET name = $1, max_count = $2, class_id = $3, school_id = $4
    WHERE group_id = $5
    RETURNING *;
    ;`


const deleteGroupQuery = `
    DELETE FROM groups
    WHERE group_id = $1
    RETURNING *;
    `;

const deleteGroupsinClassQuery = `
    DELETE FROM groups
    WHERE class_id = $1
    RETURNING *;
    `;


module.exports = {
    getIndividualGroupQuery,
    getGroupsPerClassRoomQuery,
    getGroupsPerSchoolQuery,
    checkIfGroupForClassExistsQuery,
    createGroupQuery,
    updateGroupQuery,
    deleteGroupQuery,
    getAllGroupQuery,
    deleteGroupsinClassQuery
}
