
const getAllimagesQuery = `
    SELECT * FROM images i
    INNER JOIN user_profile u ON u.id = i.user_profile_id
    WHERE u.id = $1;
  `

const getImageQuery = `
    SELECT * FROM images i
    INNER JOIN user_profile u ON u.id = i.user_profile_id
    WHERE i.assignment_number = $1 AND u.id = $2;
    `; //we return image data and look for user id and assignment number


const createImageQuery = `
    INSERT INTO images (name, data, mime_type, size, assignment_number, user_profile_id, title)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

const updateImageQuery = `
    UPDATE images SET
    name=$1, 
    data=$2, 
    mime_type=$3, 
    size=$4,
    assignment_number=$5,
    user_profile_id=$6
    title=$7,
    WHERE image_id=$8
    RETURNING *;
`

const deleteImageQuery = `
    DELETE FROM images WHERE image_id=$1 RETURNING *;
`

  module.exports = {
    getAllimagesQuery,
    getImageQuery,
    createImageQuery,
    updateImageQuery,
    deleteImageQuery
  }

