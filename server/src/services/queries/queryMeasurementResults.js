const getAllMeasurementResultsQuery = `
  SELECT * FROM measurement_results mr
  INNER JOIN user_profile u ON u.id = mr.user_id
  WHERE u.id = $1;
`;

const getSpecificMeasurementResultQuery = `
  SELECT * FROM measurement_results mr
  INNER JOIN user_profile u ON u.id = mr.user_id
  WHERE mr.assignment_number = $1 AND u.id = $2 AND mr.title = $3;
`;

const getLatestMeasurementResultQuery = `
  SELECT * FROM measurement_results mr
  INNER JOIN user_profile u ON u.id = mr.user_id
  WHERE u.id = $1
  ORDER BY mr.created_at DESC
  LIMIT 1;
  `;


const createMeasurementResultQuery = `
  INSERT INTO measurement_results (assignment_number, distance, force, energy, 
        velocity, time, user_id, title, type, motor_number, record_number)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  RETURNING *;
`;


const updateMeasurementResultQuery = `
  UPDATE measurement_results SET
  assignment_number=$1,
  distance=$2,
  force=$3,
  energy=$4,
  velocity=$5,
  time=$6,
  user_id=$7,
  title=$8,
  type=$9,
  motor_number=$10
  WHERE record_number=$11
  RETURNING *;
`;

const existInDatabaseQuery = `
  SELECT * FROM measurement_results WHERE record_number = $1
`;


const deleteMeasurementResultQuery = `
  DELETE FROM measurement_results WHERE record_number=$1 RETURNING *;
`;

  module.exports = {
    getAllMeasurementResultsQuery,
    getSpecificMeasurementResultQuery,
    getLatestMeasurementResultQuery,
    createMeasurementResultQuery,
    updateMeasurementResultQuery,
    existInDatabaseQuery,
    deleteMeasurementResultQuery
  }

