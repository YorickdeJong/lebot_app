
const checkIfAssignmentDetailsExistsQuery = `
    SELECT * FROM assignment_details
    WHERE school_id = $1 AND class_id = $2 AND group_id = $3 AND assignment_id = $4 AND subject = $5;
    `

const getSpecificAssignmentDetailsQuery = `
    SELECT * FROM assignment_details
    WHERE school_id = $1 AND class_id = $2 AND group_id = $3 AND assignment_id = $4 AND subject = $5;
    `

const getGroupAssignmentDetailsQuery = `
    SELECT * FROM assignment_details
    WHERE school_id = $1 AND class_id = $2 AND group_id = $3;
    `

    const createAssignmentDetailsQuery = `
    INSERT INTO assignment_details (school_id, class_id, group_id, assignment_id, subject, answers_multiple_choice, answers_open_questions)
    VALUES ($1, $2, $3, $4, $5, 
            COALESCE(ARRAY[$6]::jsonb[], '{}'::jsonb[]),
            COALESCE(ARRAY[$7]::jsonb[], '{}'::jsonb[]))
    RETURNING *;
`;

const updateAssignmentDetailsQuery = `
    UPDATE assignment_details
    SET 
      subject = $1,
      answers_open_questions = answers_open_questions || COALESCE(ARRAY[$2]::jsonb[], '{}'::jsonb[]),
      answers_multiple_choice = answers_multiple_choice || COALESCE(ARRAY[$3]::jsonb[], '{}'::jsonb[])
    WHERE school_id = $4 AND class_id = $5 AND group_id = $6 AND assignment_id = $7
    RETURNING *;
`;

const deleteAssignmentDetailsQuery = `
    DELETE FROM assignment_details
    WHERE school_id = $1 AND class_id = $2 AND group_id = $3 AND assignment_id = $4 AND subject = $5
    RETURNING *;
    `;

  module.exports = {
    checkIfAssignmentDetailsExistsQuery,
    getSpecificAssignmentDetailsQuery,
    getGroupAssignmentDetailsQuery,
    createAssignmentDetailsQuery,
    deleteAssignmentDetailsQuery,
    updateAssignmentDetailsQuery
  }