const pool = require('../../services/postGreSQL');

const {
    getLatestPowerMeasurementResult
} = require('./powerMeasurement.controller')

function listenToClientPower(io) {
    const powerDataNamespace = io.of('/api/v1/power-measurement-results');

    // Listen for new connections to the power-data namespace
    powerDataNamespace.on('connection', async (socket) => {
        console.log('Client connected to power-data namespace');
        const client = await pool.connect();

        socket.on('user-profile-id', (user_profile_id) => {
            console.log(user_profile_id)
            socket.user_profile_id = user_profile_id;
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected from power-data namespace');
        });


                
        async function setupNotificationListener(client) {
            await client.query('LISTEN power_data_channel'); //calls trigger function in database

            client.on('notification', async (msg) => {
                // Fetch the updated power data from the database
                console.log(`socket.user_profile_id: ${socket.user_profile_id}`)
                const powerData = await getLatestPowerMeasurementResult(client, socket.user_profile_id);

                // Emit the updated power data to the connected client
                socket.emit('power-data-update', powerData);
            });

                // Return a cleanup function that releases the client
            return () => {
                console.log('Releasing client');
                client.release();
            };
        }

        // Set up the notification listener
        setupNotificationListener(client);
    });
}


module.exports = {
    listenToClientPower,
}


