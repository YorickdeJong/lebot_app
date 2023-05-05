const checkIfAssignmentExistsQuery = `
    SELECT * FROM assignments WHERE assignment_number = $1 AND title = $2 AND subject = $3
  `; //TODO add search for title too

const getAllAssignmentsQuery = `
    SELECT * FROM assignments
  `;

const getAssignmentQuery = `
    SELECT * FROM assignments WHERE assignment_number = $1 AND title = $2
  `; //TODO add search for title too

  const getAssignmentIdByNumberQuery = `
  SELECT assignment_id FROM assignments WHERE assignment_number = $1 AND title = $2
  `; //TODO add search for title too

const createAssignmentQuery = `
    INSERT INTO assignments (assignment_number, subject, title, question, answer, currency, options, multiple_choice, answers_multiple_choice) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;

const updateAssignmentQuery = `
    UPDATE assignments SET 
    assignment_number=$1, 
    subject=$2, 
    title=$3, 
    question=$4,
    answer=$5, 
    currency=$6,
    options = $7, 
    multiple_choice = $8, 
    answers_multiple_choice = $9
    WHERE assignment_id=$10
    RETURNING *
  `

const deleteAssignmentQuery = `
  DELETE FROM assignments WHERE assignment_id=$1 RETURNING *
`




  module.exports = {
    checkIfAssignmentExistsQuery,
    getAllAssignmentsQuery,
    getAssignmentQuery,
    getAssignmentIdByNumberQuery,
    createAssignmentQuery,
    updateAssignmentQuery,
    deleteAssignmentQuery
  }