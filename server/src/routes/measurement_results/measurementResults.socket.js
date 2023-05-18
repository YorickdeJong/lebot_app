const pool = require('../../services/postGreSQL');

const {
    getLatestMeasurementResult
} = require('./measurementResults.controller')

function listenToClientMeasurementResults(io) {
    const measurementResultsNamespace = io.of('/api/v1/measurement-results');

    // Listen for new connections to the measurement-results namespace
    measurementResultsNamespace.on('connection', async (socket) => {
        console.log('Client connected to measurement-results namespace');
        const client = await pool.connect();

        socket.on('user-profile-id', (user_profile_id) => {
            console.log(user_profile_id)
            socket.user_profile_id = user_profile_id;
        });

        
        async function setupNotificationListener(client) {
            await client.query('LISTEN measurement_results_channel');
            
            client.on('notification', async (msg) => {
                // Fetch the updated measurement results from the database
                const measurementResults = await getLatestMeasurementResult(client, socket.user_profile_id);
                
                if (measurementResults.error) {
                    console.error(measurementResults.error);
                    socket.emit('sshConnectionStatus', {connected: false, message: 'Meting mislukt'})
                } 
                else {
                    // Emit the updated measurement results to the connected client
                    socket.emit('measurement-results-update', measurementResults);
                }
            });
        }
        
        socket.on('disconnect', () => {
            console.log('Client disconnected from measurement-results namespace');
            client.release();
        });

        // Set up the notification listener
        setupNotificationListener(client);
    });
}

module.exports = {
    listenToClientMeasurementResults
}