const {
    insertAssignmentQuery,
    getAssignmentsForUserQuery,
    updateCompletionStatusQuery
} = require('../../services/queries/queryLinkProfileToAssignment')
const pool = require('../../services/postGreSQL')

// Function to insert a new assignment into the assignments table
async function insertAssignment(subject, assignmentNumber, title, description, imageFilePath) {
  const query = insertAssignmentQuery
  const values = [subject, assignmentNumber, title, description, imageFilePath];

  try {
    const res = await pool.query(query, values);
    return res.rows[0].id;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Function to retrieve all assignments for a user
async function getAssignmentsForUser(userId) {
  const query = getAssignmentsForUserQuery
  const values = [userId];

  try {
    const res = await pool.query(query, values);
    return res.rows;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Function to update the completion status of an assignment
async function updateCompletionStatus(assignmentId, completionStatus) {
  const query = updateCompletionStatusQuery
  const values = [assignmentId, completionStatus];

  try {
    await pool.query(query, values);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

module.exports = {
    insertAssignment,
    getAssignmentsForUser,
    updateCompletionStatus
}