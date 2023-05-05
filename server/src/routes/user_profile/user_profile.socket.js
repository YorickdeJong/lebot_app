
const pool = require('../../services/postGreSQL');
const { getUsersInGroup } = require('./user_profile.controller');
 
function listenToClientUser(io) {
    const userNamespace = io.of('/api/v1/user/users-in-group');
    let connectionCount = 0;

    userNamespace.on('connection', (socket) => {
        console.log('Client connected to USER');
        
        let group_ids;

        async function setupNotificationListener() {
            const client = await pool.connect();
            await client.query('LISTEN user_profile_channel');

            client.on('notification', async (msg) => {
                if (!group_ids) {
                    console.log('Releasing client');
                    client.release();
                    return
                }
                const results = await Promise.all(group_ids.map(async (group_id) => {
                    const result = await getUsersInGroup(group_id);
                    console.log('users in group', result)
                    if (result.status === 200) {
                        const names = result.data.map(user => user.name);
                        return { group_id, names };
                    } 
                    else {
                        return { group_id, names: [] };
                    }
                }));

                userNamespace.emit('fetch-data-update', results);
            });

            return () => {
                console.log('Releasing client');
                client.release();
            };
        }

        socket.on('initialize', async ({ group_ids: groupIds }) => {
            const group_ids = groupIds;
            if (!group_ids) {
                console.log('Releasing client');
                client.release();
                return
            }
            const results = await Promise.all(group_ids.map(async (group_id) => {
                const result = await getUsersInGroup(group_id);
                console.log('users in group', result)
                if (result.status === 200) {
                    const names = result.data.map(user => user.name);
                    return { group_id, names };
                } 
                else {
                    return { group_id, names: [] };
                }
            }));

            userNamespace.emit('fetch-data-update', results);

            const cleanupNotificationListener = await setupNotificationListener();

            socket.on('disconnect', () => {
                console.log('Client disconnected from user');
                cleanupNotificationListener();
                connectionCount--;
            });
        });
    });
}

module.exports = {
    listenToClientUser,
};
