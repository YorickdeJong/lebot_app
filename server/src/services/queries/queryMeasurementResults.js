const getAllMeasurementResultsQuery = `
  SELECT mr.assignment_number, mr.distance_time, mr.velocity_time, mr.user_id, mr.title, mr.created_at, mr.type, mr.id, mr.record_number, mr.motor_number, mr.subject, mr.school_id, mr.class_id, mr.group_id FROM measurement_results mr
  INNER JOIN user_profile u ON u.id = mr.user_id
  WHERE u.id = $1;
  `;

const getSpecificMeasurementResultQuery = `
  SELECT mr.assignment_number, mr.distance_time, mr.velocity_time, mr.user_id, mr.title, mr.created_at, mr.type, mr.id, mr.record_number, mr.motor_number, mr.subject, mr.school_id, mr.class_id, mr.group_id FROM measurement_results mr
  INNER JOIN user_profile u ON u.id = mr.user_id
  WHERE mr.assignment_number = $1 AND mr.title = $2 AND mr.subject = $3 AND u.school_id = $4 AND u.class_id = $5 AND u.group_id = $6;
  `;

const getLatestMeasurementResultQuery = `
  SELECT mr.assignment_number, mr.distance_time, mr.velocity_time, mr.user_id, mr.title, mr.created_at, mr.type, mr.id, mr.record_number, mr.motor_number, mr.subject, mr.school_id, mr.class_id, mr.group_id FROM measurement_results mr
  INNER JOIN user_profile u ON u.id = mr.user_id
  WHERE u.id = $1
  ORDER BY mr.created_at DESC
  LIMIT 1;
  `;



const createMeasurementResultQuery = `
  INSERT INTO measurement_results (school_id, class_id, group_id, assignment_number, distance_time,
        velocity_time, user_id, title, type, motor_number, subject, record_number)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
  RETURNING *;
`;


const updateMeasurementResultQuery = `
  UPDATE measurement_results SET
  school_id = $1, 
  class_id =$2, 
  group_id =$3,
  assignment_number=$4,
  distance_time=$5,
  velocity_time=$6,
  user_id=$7,
  title=$8,
  type=$9,
  motor_number=$10,
  subject=$11
  WHERE record_number=$12
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

