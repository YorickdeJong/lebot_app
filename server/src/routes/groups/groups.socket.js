const { getUsersInGroup } = require('../groups/groupsInfo.controller');
const { getGroupsPerClassRoom } = require('../groups/groups.controller');

const pool = require('../../services/postGreSQL');

function listenToClientGroups(io) {
    const groupsNamespace = io.of('/api/v1/groups');
  
    groupsNamespace.on('connection', async (socket) => {
      console.log('Client connected to groups');
      const client = await pool.connect();
  
      let user_id;
      let classroom_id;
      let school_id;
  
      // Move the setup and cleanup of the notification listener outside the 'initialize' event
      let cleanupNotificationListener = await setupNotificationListener(client);
  
      async function setupNotificationListener(client) {
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
  
          groupsNamespace.emit('fetch-data-update', updatedData);
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

            await fetchDataAndNotifyGroups(client, classroom_id, school_id, groupsNamespace);
      });
  
      socket.on('disconnect', () => {
            console.log('Client disconnected from groups');
            if (cleanupNotificationListener) {
                cleanupNotificationListener();
            }
        });
    });
}
  
async function fetchDataAndNotifyGroups(client, classroom_id, school_id, groupsNamespace) {
    const fetchedData = await getGroupsPerClassRoom(client, classroom_id, school_id);

    console.log('fetchedData', fetchedData);

    if (fetchedData.status === 404 || fetchedData.status === 500) {
        console.log(fetchedData.message);
        console.log('fetchDataAndNotifyGroups groups data is empty, returning []');
        groupsNamespace.emit('fetch-data-update', []);
        return;
    }

    const updatedData = await Promise.all(
        fetchedData.data.map(async (item) => {
            const countData = await getUsersInGroup(client, item.group_id);
            return { ...item, current_count: countData.count };
        })
    );

    groupsNamespace.emit('fetch-data-update', updatedData);
}

module.exports = { listenToClientGroups };