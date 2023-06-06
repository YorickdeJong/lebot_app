const { getUsersInGroup } = require('../groups/groupsInfo.controller');
const { getUsersNamesInGroup } = require('../user_profile/user_profile.controller')
const { getGroupsPerClassRoom } = require('../groups/groups.controller');

const pool = require('../../services/postGreSQL');
const { Mutex } = require('async-mutex');

const mutex = new Mutex();
const clientPool = new Map(); // Stores database connections per school

function listenToClientGroups(io) {
  const groupsNamespace = io.of('/api/v1/groups');

  // Active socket counts per school
  const activeSockets = new Map();

  groupsNamespace.on('connection', async (socket) => {
    console.log('Client connected to groups');

    let user_id;
    let classroom_id;
    let school_id;

    let cleanupNotificationListener;

  
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
            groupsNamespace.to(classroom_id).emit('fetch-data-update', []);
            return;
          }
  
          const updatedData = await Promise.all(
            fetchedData.data.map(async (item) => {
                const countData = await getUsersInGroup(client, item.group_id);
                const result = await getUsersNamesInGroup(client, item.group_id);
                let usernames = []
                if (result.status === 200) {
                    usernames = result.data.map((user) => user.name);
                }
                // add getUsersInGroup here
                return { ...item, current_count: countData.count, usernames};
            })
          );
  
          groupsNamespace.to(classroom_id).emit('fetch-data-update', updatedData);
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

          try {
              socket.join(classroom_id); // Add socket to a room based on school_id
          
              // Update the active sockets count
              activeSockets.set(classroom_id, (activeSockets.get(classroom_id) || 0) + 1);
        
        
              let client;
              if (!clientPool.has(classroom_id)) {
                  client = await pool.connect();
                  cleanupNotificationListener = await setupNotificationListener(client);
                  clientPool.set(classroom_id, { client, cleanupNotificationListener });
              } 
              else {
                  const poolData = clientPool.get(classroom_id);
                  client = poolData.client;
                  cleanupNotificationListener = poolData.cleanupNotificationListener;
              }
        
              await fetchDataAndNotifyGroups(client, classroom_id, school_id, groupsNamespace);          
          }
          catch (error) {
              console.error('Error initializing groups socket:', error);
              // socket.emit('error', 'Error initializing groups socket');
          }
        });
    
        socket.on('disconnect', () => {
          console.log('Client disconnected from groups');
          try {
              socket.leave(classroom_id); // Remove socket from the room when disconnected
              // Optionally release the client connection if no more clients for this school
              // Update the active sockets count
              mutex.runExclusive(() => {
                const currentCount = activeSockets.get(classroom_id) || 0;
                if (currentCount > 1) {
                    activeSockets.set(classroom_id, currentCount - 1);
                } 
                else {
                    activeSockets.delete(classroom_id);
                    const poolData = clientPool.get(classroom_id);
                    if (poolData) {
                        const { client, cleanupNotificationListener } = poolData;
                        if (client && clientPool.has(classroom_id)) {
                            cleanupNotificationListener();
                            clientPool.delete(classroom_id);
                        }
                    }
                }
            }).catch((error) => {
                console.error('Error disconnecting groups socket:', error);
            });
          }
          catch (error) {
              console.error('Error disconnecting groups socket:', error);
              // socket.emit('error', 'Error disconnecting groups socket');
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
        groupsNamespace.to(classroom_id).emit('fetch-data-update', []);
        return;
    }

    const updatedData = await Promise.all(
        fetchedData.data.map(async (item) => {
            const countData = await getUsersInGroup(client, item.group_id);
            const result = await getUsersNamesInGroup(client, item.group_id);
            let usernames = [];
            if (result.status === 200) {
              usernames = result.data.map((user) => user.name);
            }
            //add getUsersInGroup here and add to countData
            return { ...item, current_count: countData.count, usernames };
        })
    );

    groupsNamespace.to(classroom_id).emit('fetch-data-update', updatedData);
}

module.exports = { listenToClientGroups };
