

const postChatgptQuery = `
    INSERT INTO chatgpt (user_id, question, answer, thread_id) 
    VALUES ($1, $2, $3, $4) 
    `;

const getAllChatHistoryQuery = `
    SELECT * FROM chatgpt 
    WHERE user_id = $1
    ORDER BY created_at DESC
    `;

const getCurrentChatHistoryQuery = `
    SELECT * FROM chatgpt 
    WHERE user_id = $1 AND thread_id = $2
    ORDER BY created_at DESC
    `;

const deleteChatHistoryQuery = `
    DELETE FROM chatgpt WHERE thread_id = $1 AND user_id = $2
    `;


const getDescriptionQuery = `
    SELECT * FROM Posts WHERE user_id = $1 AND thread_id = $2
`

const createDescriptionQuery = `
    INSERT INTO Posts (user_id, description, thread_id) VALUES ($1, $2, $3);
`

const deleteDescriptionQuery = `
    DELETE FROM Posts WHERE user_id = $1 AND thread_id = $2
`

module.exports = { 
    postChatgptQuery,
    getAllChatHistoryQuery,
    getCurrentChatHistoryQuery,
    deleteChatHistoryQuery,
    getDescriptionQuery,
    createDescriptionQuery,
    deleteDescriptionQuery
}