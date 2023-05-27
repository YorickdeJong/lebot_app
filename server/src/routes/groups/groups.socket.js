const { getUsersInGroup } = require('../groups/groupsInfo.controller');
const { getGroupsPerClassRoom } = require('../groups/groups.controller');

const pool = require('../../services/postGreSQL');

function listenToClientGroups(io) {
    const groupsNamespace = io.of('/api/v1/groups');

    // Stores the cleanupNotificationListener functions for each school
    const cleanupFunctions = {};

    groupsNamespace.on('connection', async (socket) => {
      console.log('Client connected to groups');

      socket.on('initialize', async ({ user_id, classroom_id, school_id }) => {
        // add this user to the room corresponding to their school
        socket.join(`school-${school_id}`);

        // Establish a new database connection for each school
        if(!schoolClients[school_id]) {
            const client = await pool.connect();
            schoolClients[school_id] = client;
            cleanupFunctions[school_id] = await setupNotificationListener(client, classroom_id, school_id, groupsNamespace);

            socket.on('disconnect', () => {
                console.log('Client disconnected from groups');
                // If there are no more clients in the school room, clean up the listener and release the client
                if (Object.keys(groupsNamespace.adapter.rooms[`school-${school_id}`] || {}).length === 0) {
                    cleanupFunctions[school_id]();
                    delete schoolClients[school_id];
                    delete cleanupFunctions[school_id];
                }
            });
        }

        await fetchDataAndNotifyGroups(schoolClients[school_id], classroom_id, school_id, groupsNamespace.to(`school-${school_id}`));
    });
  });

  async function setupNotificationListener(client, classroom_id, school_id, groupsNamespace) {
    await client.query('LISTEN groups_channel');

    client.on('notification', async (msg) => {
      if (!classroom_id || !school_id) {
        return;
      }

      const fetchedData = await getGroupsPerClassRoom(client, classroom_id, school_id);

      console.log('fetchedData', fetchedData);

      if (fetchedData.status === 404 || fetchedData.status === 500) {
        console.log(fetchedData.message);
        console.log('setupNotificationListener groups data is empty, returning []');
        groupsNamespace.emit('fetch-data-update', []);
        return;
      }

      const updatedData = await Promise.all(
        fetchedData.data.map(async (item) => {
            const countData = await getUsersInGroup(client, item.group_id);
            return { ...item, current_count: countData.count };
        })
      );

      groupsNamespace.to(`school-${school_id}`).emit('fetch-data-update', updatedData);
    });

    return () => {
        console.log('Releasing client');
        client.release();
    };
  }
}



module.exports = { listenToClientGroups };