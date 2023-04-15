
const getSpecificPowerMeasurementResultQuery = `
  SELECT * FROM power_data pd
  INNER JOIN user_profile u ON u.id = pd.user_id
  WHERE pd.assignment_number = $1 AND u.id = $2 AND pd.title = $3 AND pd.subject = $4;
`;

const getLatestPowerMeasurementResultQuery = `
  SELECT * FROM power_data pd
  INNER JOIN user_profile u ON u.id = pd.user_id
  WHERE u.id = $1
  ORDER BY pd.created_at DESC
  LIMIT 1;
  `;


const createPowerMeasurementResultQuery = `
    INSERT INTO power_data (assignment_number, power, time, user_id, title, subject, record_number)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
`;


const updatePowerMeasurementResultQuery = `
  UPDATE power_data SET
    assignment_number=$1,
    power=$2,
    time=$3,
    user_id=$4,
    title=$5,
    subject=$6
    WHERE record_number=$7
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

