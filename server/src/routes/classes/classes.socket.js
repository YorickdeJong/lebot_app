const { getUsersInClass } = require('../classes/classesInfo.controller');
const { getClassesPerSchool } = require('../classes/classes.controller');

const pool = require('../../services/postGreSQL');

const clientPool = new Map(); // Stores database connections per school

function listenToClientClasses(io) {
    const classesNamespace = io.of('/api/v1/classes');

    // Active socket counts per school
    const activeSockets = new Map();

    classesNamespace.on('connection', async (socket) => {
        console.log('Client connected to classes');

        let school_id;
        let cleanupNotificationListener;

        async function setupNotificationListener(client) {
            await client.query('LISTEN classes_channel');

            client.on('notification', async (msg) => {
                if (!school_id) {
                    return;
                }

                await fetchDataAndNotifyClasses(client, school_id, classesNamespace);
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

                await fetchDataAndNotifyClasses(client, school_id, classesNamespace);
            } catch (error) {
                console.error('Error initializing classes socket:', error);
                // socket.emit('error', 'Error initializing classes socket');
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected from classes');
            try {
                socket.leave(school_id); // Remove socket from the room when disconnected
        
                // Optionally release the client connection if no more clients for this school
                // Update the active sockets count
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
            } catch (error) {
                console.error('Error disconnecting classes socket:', error);
                // socket.emit('error', 'Error disconnecting classes socket');
            }
        });
    });
}


async function fetchDataAndNotifyClasses(client, school_id, classesNamespace) {
    const fetchedData = await getClassesPerSchool(client, school_id);

    console.log('fetchedData', fetchedData);

    if (fetchedData.status === 404 || fetchedData.status === 500) {
        console.log(fetchedData.message);
        console.log('fetchDataAndNotifyClasses classes data is empty, returning []');
        classesNamespace.to(school_id).emit('fetch-data-update', []);
        return;
    }

    const updatedData = await Promise.all(
        fetchedData.data.map(async (item) => {
            const countData = await getUsersInClass(client, item.class_id);
            return { ...item, current_count: countData.count };
        })
    );

    classesNamespace.to(school_id).emit('fetch-data-update', updatedData);
}

module.exports = { listenToClientClasses };

