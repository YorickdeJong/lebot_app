const pool = require('../../services/postGreSQL');

const {
    getLatestMeasurementResult
} = require('./measurementResults.controller')

function listenToClientMeasurementResults(io) {
    const measurementResultsNamespace = io.of('/api/v1/measurement-results');

    measurementResultsNamespace.on('connection', (socket) => {
        console.log('Client connected to measurement-results namespace');

        socket.on('user-profile-id', async (user_profile_id) => {
            console.log(user_profile_id)
            socket.user_profile_id = user_profile_id;

            const client = await pool.connect();

            async function setupNotificationListener(client) {
                await client.query('LISTEN measurement_results_channel');
                
                client.on('notification', async (msg) => {
                    const measurementResults = await getLatestMeasurementResult(client, socket.user_profile_id);
                    
                    if (measurementResults.error) {
                        console.error(measurementResults.error);
                        socket.emit('sshConnectionStatus', {connected: false, message: 'Meting mislukt'})
                    } 
                    else {
                        socket.emit('measurement-results-update', measurementResults);
                    }
                });
            }

            socket.on('disconnect', () => {
                console.log('Client disconnected from measurement-results namespace');
                client.release();
            });

            setupNotificationListener(client);
        });
    });
}

module.exports = {
    listenToClientMeasurementResults
}