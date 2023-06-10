const pool = require('../../services/postGreSQL');

const {
    getLatestMeasurementResult
} = require('./measurementResults.controller')

function listenToClientMeasurementResults(io) {
    const measurementResultsNamespace = io.of('/api/v1/measurement-results');

    measurementResultsNamespace.on('connection', (socket) => {
        console.log('Client connected to measurement-results namespace');
    
        socket.on('group-movement-measurement', async (group_id) => {
            console.log(group_id)
            socket.group_id = group_id;
    
            // Join the socket to the room identified by group_id.
            socket.join(group_id);
    
            const client = await pool.connect();
    
            async function setupNotificationListener(client) {
                await client.query('LISTEN measurement_results_channel');
                
                client.on('notification', async (msg) => {
                    const measurementResults = await getLatestMeasurementResult(client, socket.group_id);
                    
                    if (measurementResults.error) {
                        console.error(measurementResults.error);
                        socket.emit('sshConnectionStatus', {connected: false, message: 'Meting mislukt'})
                    } 
                    else {
                        // Emit to all sockets in the group_id room.
                        measurementResultsNamespace.to(socket.group_id).emit('measurement-results-update', measurementResults);
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