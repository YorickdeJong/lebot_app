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
  INSERT INTO measurement_results (assignment_number, distance, distance_force, force, energy, 
        velocity, time, time_velocity, time_energy, 
        user_id, title, type, record_number)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
  RETURNING *;
`;


const updateMeasurementResultQuery = `
  UPDATE measurement_results SET
  assignment_number=$1,
  distance=$2,
  distance_force=$3,
  force=$4,
  energy=$5,
  velocity=$6,
  time=$7,
  time_velocity=$8,
  time_energy=$9,
  user_id=$10,
  title=$11,
  type=$12
  WHERE record_number=$13
  RETURNING *;
`;

const existInDatabaseQuery = `
    SELECT * FROM measurement_results WHERE record_number = $1
`;


const deleteMeasurementResultQuery = `
  DELETE FROM measurement_results WHERE id=$1 RETURNING *;
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

