const getBrainstormTextQuery = `
    SELECT * FROM brainstorm_text 
    WHERE user_id = $1 AND assignment_number = $2 AND subject = $3
    `;

const createBrainstormTextQuery = `
    INSERT INTO brainstorm_text(user_id, subject, assignment_number, text_one, text_two, text_three, text_four) 
    VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `;

const updateBrainstormTextQuery = `
    UPDATE brainstorm_text SET 
    text_one = $1, 
    text_two = $2, 
    text_three = $3, 
    text_four = $4
    WHERE user_id = $5 AND assignment_number = $6 AND subject = $7 
    RETURNING *
    `;

const deleteBrainstormTextQuery = `
    DELETE FROM brainstorm_text 
    WHERE user_id = $1 AND assignment_number = $2 AND subject = $3 RETURNING *
    `;

module.exports = {
    getBrainstormTextQuery,
    createBrainstormTextQuery,
    updateBrainstormTextQuery,
    deleteBrainstormTextQuery
};