
const getSpecificPowerMeasurementResultQuery = `
  SELECT * FROM power_data WHERE assignment_number = $1 AND title = $2 AND subject = $3 AND school_id = $4 AND class_id = $5 AND group_id = $6;
`;

const getLatestPowerMeasurementResultQuery = `
    SELECT * 
    FROM power_data 
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 1;
`;

const createPowerMeasurementResultQuery = `
    INSERT INTO power_data (school_id, class_id, group_id, assignment_number, power_array, time_array, current_array, voltage_array, user_id, title, subject, record_number)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *;
`;


const updatePowerMeasurementResultQuery = `
  UPDATE power_data SET
    school_id = $1, 
    class_id = $2, 
    group_id = $3,
    assignment_number=$4,
    power_array=$5,
    time_array=$6,
    current_array=$7,
    voltage_array=$8,
    user_id=$9,
    title=$10,
    subject=$11
    WHERE record_number=$12
    RETURNING *;
`;

const existInDatabaseQuery = `
  SELECT * FROM power_data WHERE record_number = $1
`;


const deletePowerMeasurementResultQuery = `
  DELETE FROM power_data WHERE record_number=$1 RETURNING *;
`;

  module.exports = {
    getSpecificPowerMeasurementResultQuery,
    getLatestPowerMeasurementResultQuery,
    createPowerMeasurementResultQuery,
    updatePowerMeasurementResultQuery,
    deletePowerMeasurementResultQuery,
    existInDatabaseQuery,
  }

