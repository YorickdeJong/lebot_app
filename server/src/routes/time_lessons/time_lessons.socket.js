const pool = require('../../services/postGreSQL');

const {
    getAllTimeLessonsForSchoolSocket
} = require('./time_lessons.controller');

const { Mutex } = require('async-mutex');

const mutex = new Mutex();
const clientPool = new Map(); // Stores database connections per school

function listenToClientTimeLessons(io) {
    const timeLessonsNamespace = io.of('/time-lessons');

    // Active socket counts per school
    const activeSockets = new Map();

    timeLessonsNamespace.on('connection', async (socket) => {
        console.log('Client connected to time-lessons namespace');

        let school_id;
        let cleanupNotificationListener;

        async function setupNotificationListener(client) {
            await client.query('LISTEN time_lessons_channel');

            client.on('notification', async (msg) => {
                if (!school_id) {
                    return;
                }

                await fetchDataAndNotifyTimeLessons(client, school_id, timeLessonsNamespace);
            });

            return () => {
                console.log('Releasing client');
                client.release();
            };
        }

        socket.on('initialize', async ({ school_id: schoolId }) => {
            school_id = schoolId;
            try {
                socket.join(school_id); // Add socket to a room based on school_id

                // Update the active sockets count
                activeSockets.set(school_id, (activeSockets.get(school_id) || 0) + 1);

                let client;
                if (!clientPool.has(school_id)) {
                    client = await pool.connect();
                    cleanupNotificationListener = await setupNotificationListener(client);
                    clientPool.set(school_id, { client, cleanupNotificationListener });
                } 
                else {
                    const poolData = clientPool.get(school_id);
                    client = poolData.client;
                    cleanupNotificationListener = poolData.cleanupNotificationListener;
                }

                await fetchDataAndNotifyTimeLessons(client, school_id, timeLessonsNamespace);
            } catch (error) {
                console.error('Error initializing time-lessons socket:', error);
                // socket.emit('error', 'Error initializing time-lessons socket');
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected from time-lessons');
            try {
                socket.leave(school_id); // Remove socket from the room when disconnected
        
                // Optionally release the client connection if no more clients for this school
                // Update the active sockets count
                mutex.runExclusive(() => {
                    const currentCount = activeSockets.get(school_id) || 0;
            
                    if (currentCount > 1) {
                        activeSockets.set(school_id, currentCount - 1);
                    } else {
                        activeSockets.delete(school_id);
                        const poolData = clientPool.get(school_id);
                        if (poolData) {
                            const { client, cleanupNotificationListener } = poolData;
                            // Only call cleanupNotificationListener and release the client if it hasn't been released yet
                            if (client) {
                                cleanupNotificationListener();
                                client.release();
                                clientPool.delete(school_id);
                            }
                        }
                    }
                }).catch((error) => {
                        console.error('Error disconnecting groups socket:', error);
                });
            } 
            catch (error) {
                console.error('Error disconnecting time-lessons socket:', error);
                // socket.emit('error', 'Error disconnecting time-lessons socket');
            }
        });
    });
}

async function fetchDataAndNotifyTimeLessons(client, school_id, timeLessonsNamespace) {
    const timeLessonsData = await getAllTimeLessonsForSchoolSocket(client, school_id);

    if (timeLessonsData.status === 404 || timeLessonsData.status === 500) {
        console.log(timeLessonsData.message);
        console.log('fetchDataAndNotifyTimeLessons time lessons data is empty, returning []');
        timeLessonsNamespace.to(school_id).emit('time-lessons-update', []);
        return;
    }

    timeLessonsNamespace.to(school_id).emit('time-lessons-update', timeLessonsData);
}


module.exports = {
    listenToClientTimeLessons,
};