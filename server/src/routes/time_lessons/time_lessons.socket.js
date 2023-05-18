const pool = require('../../services/postGreSQL');

const {
    getAllTimeLessonsForSchoolSocket
} = require('./time_lessons.controller');

function listenToClientTimeLessons(io) {
    const timeLessonsNamespace = io.of('/time-lessons');

    timeLessonsNamespace.on('connection', async (socket) => {
        const client = await pool.connect();
        console.log('Client connected to time-lessons namespace');

        let school_id;
        let cleanupNotificationListener = await setupNotificationListener(client);

        async function setupNotificationListener(client) {
            await client.query('LISTEN time_lessons_channel');

            client.on('notification', async (msg) => {
                await fetchDataAndNotifyTimeLessons(client, school_id, timeLessonsNamespace);
            });

            return () => {
                console.log('Releasing client');
                client.release();
            };
        }

        async function fetchDataAndNotifyTimeLessons(client, school_id, timeLessonsNamespace) {
            const timeLessonsData = await getAllTimeLessonsForSchoolSocket(client, school_id);
            timeLessonsNamespace.emit('time-lessons-update', timeLessonsData);
        }

        socket.on('initialize', async ({ school_id: schoolId }) => {
            school_id = schoolId;

            await fetchDataAndNotifyTimeLessons(client, school_id, timeLessonsNamespace);

        });

        socket.on('disconnect', () => {
            console.log('Client disconnected from groups');
            if (cleanupNotificationListener) {
                cleanupNotificationListener();
            }
        });
    });
}


module.exports = {
    listenToClientTimeLessons,
};