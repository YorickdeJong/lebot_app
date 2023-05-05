const { getUsersInClass } = require('../classes/classesInfo.controller');
const { getClassesPerSchool } = require('../classes/classes.controller');

const pool = require('../../services/postGreSQL');

function listenToClientClasses(io) {
    const classesNamespace = io.of('/api/v1/classes');

    classesNamespace.on('connection', (socket) => {
        console.log('Client connected to classes');

        let user_id;
        let classroom_id;
        let school_id;

        async function setupNotificationListener() {
            const client = await pool.connect();
            await client.query('LISTEN classes_channel');

            client.on('notification', async (msg) => {
                const fetchedData = await getClassesPerSchool(school_id);

                console.log('fetchedData', fetchedData);

                if (fetchedData.status === 404 || fetchedData.status === 500) {
                    console.log(fetchedData.message);
                    console.log('setupNotificationListener classes data is empty, returning []');
                    classesNamespace.emit('fetch-data-update', []);
                    return;
                }

                const updatedData = await Promise.all(
                    fetchedData.data.map(async (item) => {
                        const countData = await getUsersInClass(item.class_id);
                        return { ...item, current_count: countData.count };
                    })
                );

                classesNamespace.emit('fetch-data-update', updatedData);
            });

            return () => {
                console.log('Releasing client');
                client.release();
            };
        }

        socket.on('initialize', async ({ user_id: userId, classroom_id: classroomId, school_id: schoolId }) => {
            user_id = userId;
            classroom_id = classroomId;
            school_id = schoolId;

            await fetchDataAndNotifyClasses(school_id, classesNamespace);

            const cleanupNotificationListener = await setupNotificationListener();

            socket.on('disconnect', () => {
                console.log('Client disconnected from classes');
                cleanupNotificationListener();
            });
        });
    });
}

async function fetchDataAndNotifyClasses(school_id, classesNamespace) {
    const fetchedData = await getClassesPerSchool(school_id);

    console.log('fetchedData', fetchedData);

    if (fetchedData.status === 404 || fetchedData.status === 500) {
        console.log(fetchedData.message);
        console.log('fetchDataAndNotifyClasses classes data is empty, returning []');
        classesNamespace.emit('fetch-data-update', []);
        return;
    }

    const updatedData = await Promise.all(
        fetchedData.data.map(async (item) => {
            const countData = await getUsersInClass(item.class_id);
            return { ...item, current_count: countData.count };
        })
    );

    console.log('fetch-updated-date', updatedData);
    classesNamespace.emit('fetch-data-update', updatedData);
}

module.exports = { listenToClientClasses };
