const pool = require('../../services/postGreSQL');

const {
    getLatestMeasurementResult
} = require('./measurementResults.controller')

function listenToClientMeasurementResults(io) {
    const measurementResultsNamespace = io.of('/api/v1/measurement-results');

    // Listen for new connections to the measurement-results namespace
    measurementResultsNamespace.on('connection', (socket) => {
        console.log('Client connected to measurement-results namespace');

        socket.on('user-profile-id', (user_profile_id) => {
            console.log(user_profile_id)
            socket.user_profile_id = user_profile_id;
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected from measurement-results namespace');
        });

        async function setupNotificationListener() {
            const client = await pool.connect();
            await client.query('LISTEN measurement_results_channel');

            client.on('notification', async (msg) => {
                // Fetch the updated measurement results from the database
                console.log(`socket.user_profile_id: ${socket.user_profile_id}`)
                const measurementResults = await getLatestMeasurementResult(socket.user_profile_id);
                
                if (measurementResults.error) {
                    console.error(measurementResults.error);
                } 
                else {
                    console.log(measurementResults)
                    // Emit the updated measurement results to the connected client
                    socket.emit('measurement-results-update', measurementResults);
                }
            });
        }

        // Set up the notification listener
        setupNotificationListener();
    });
}

module.exports = {
    listenToClientMeasurementResults
}