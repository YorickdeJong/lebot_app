const { getUsersInClass } = require('../classes/classesInfo.controller');
const { getClassesPerSchool } = require('../classes/classes.controller');

const pool = require('../../services/postGreSQL');

function listenToClientClasses(io) {
    const classesNamespace = io.of('/api/v1/classes');

    classesNamespace.on('connection', async (socket) => {
        console.log('Client connected to classes');
        const client = await pool.connect();

        let school_id;
        let cleanupNotificationListener = await setupNotificationListener(client);;

        async function setupNotificationListener(client) {
            await client.query('LISTEN classes_channel');

            client.on('notification', async (msg) => {
                await fetchDataAndNotifyClasses(client, school_id, classesNamespace);
            });

            return () => {
                console.log('Releasing client');
                client.release();
            };
        }

        async function fetchDataAndNotifyClasses(client, school_id, classesNamespace) {
            const fetchedData = await getClassesPerSchool(client, school_id);

            console.log('fetchedData', fetchedData);

            if (fetchedData.status === 404 || fetchedData.status === 500) {
                console.log(fetchedData.message);
                console.log('fetchDataAndNotifyClasses classes data is empty, returning []');
                classesNamespace.emit('fetch-data-update', []);
                return;
            }

            const updatedData = await Promise.all(
                fetchedData.data.map(async (item) => {
                    const countData = await getUsersInClass(client, item.class_id);
                    return { ...item, current_count: countData.count };
                })
            );

            classesNamespace.emit('fetch-data-update', updatedData);
        }

        socket.on('initialize', async ({ school_id: schoolId }) => {
            school_id = schoolId;

            await fetchDataAndNotifyClasses(client, school_id, classesNamespace);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected from groups');
            if (cleanupNotificationListener) {
                cleanupNotificationListener();
            }
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
