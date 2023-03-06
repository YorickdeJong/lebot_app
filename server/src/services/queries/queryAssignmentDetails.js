
const checkIfAssignmentDetailsExistsQuery = `
    SELECT * FROM assignment_details WHERE user_id = $1 AND assignment_id = $2
    `

const getSpecificAssignmentDetailsQuery = `
    SELECT a.assignment_number AS assignment_number, a.assignment_id AS assignment_id, a.title AS title, u.id AS user_id
    FROM assignments a
    INNER JOIN assignment_details c ON a.assignment_id = c.assignment_id
    INNER JOIN user_profile u ON u.id = c.user_id
    WHERE u.id = $1 AND a.assignment_id = $2
    `

const getUserAssignmentDetailsQuery = `
    SELECT a.assignment_id, a.assignment_number, a.title
    FROM assignments a
    INNER JOIN assignment_details c ON a.assignment_id = c.assignment_id
    INNER JOIN user_profile u ON u.id = c.user_id
    WHERE u.id = $1;
    `

const createAssignmentDetailsQuery = `
    INSERT INTO assignment_details (user_id, assignment_id)
    VALUES ($1, $2)
    RETURNING *;
    `;

  const deleteAssignmentDetailsQuery = `
    DELETE FROM assignment_details WHERE user_id = $1 AND assignment_id=$2 RETURNING *
    `;

  module.exports = {
    checkIfAssignmentDetailsExistsQuery,
    getSpecificAssignmentDetailsQuery,
    getUserAssignmentDetailsQuery,
    createAssignmentDetailsQuery,
    deleteAssignmentDetailsQuery
  }