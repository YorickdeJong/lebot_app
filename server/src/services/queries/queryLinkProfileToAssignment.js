const insertAssignmentQuery = `
    INSERT INTO assignments (subject, assignment_number, title, description, image_file_path)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
  `;

const getAssignmentsForUserQuery = `
    SELECT a.subject, a.assignment_number, a.title, a.description, a.image_file_path
    FROM assignments a
    INNER JOIN user_profiles up ON a.user_id = up.id
    WHERE up.id = $1
    ORDER BY a.assignment_number;
  `;

const updateCompletionStatusQuery = `
    UPDATE assignments
    SET completion_status = $2
    WHERE id = $1;
  `;


  module.exports = {
    insertAssignmentQuery,
    getAssignmentsForUserQuery,
    updateCompletionStatusQuery
  }