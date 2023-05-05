
const getSpecificSchoolQuery = `
    SELECT * FROM schools WHERE school_name = $1
    `;

const getAllSchoolsQuery = `
    SELECT * FROM schools
    `;


const createSchoolQuery = `
    INSERT INTO schools (school_name)
    VALUES ($1)
    RETURNING *;
    `;

const updateSchoolQuery = `
    UPDATE schools SET school_name = $1 WHERE school_id = $2 RETURNING *
    `;

const deleteSchoolByNameQuery = `
    DELETE FROM schools WHERE school_name = $1 RETURNING *
    `;

const deleteSchoolByIDQuery = `
    DELETE FROM schools WHERE school_id = $1 RETURNING *
    `;

  module.exports = {
    getSpecificSchoolQuery,
    getAllSchoolsQuery,
    createSchoolQuery,
    updateSchoolQuery,
    deleteSchoolByNameQuery,
    deleteSchoolByIDQuery
  }