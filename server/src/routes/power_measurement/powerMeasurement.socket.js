const pool = require('../../services/postGreSQL');

const {
    getLatestPowerMeasurementResult
} = require('./powerMeasurement.controller')

function listenToClientPower(io) {
  const powerDataNamespace = io.of('/power-data');
  powerDataNamespace.on('connection', (socket) => {
        console.log('Client connected to power-data namespace');

        socket.on('disconnect', () => {
            console.log('Client disconnected from power-data namespace');
        });
  });

  async function setupNotificationListener() {
        const client = await pool.connect();
        await client.query('LISTEN power_data_channel');

        client.on('notification', async (msg) => {
            const powerDataId = msg.payload;

            // Fetch the updated power data from the database
            const powerData = await getLatestPowerMeasurementResult(powerDataId);

            // Emit the updated power data to all connected clients
            powerDataNamespace.emit('power-data-update', powerData);
        });
  }


  // Set up the notification listener
  setupNotificationListener();
}

module.exports = listenToClientPower;



module.exports = {
    listenToClientPower,
}


