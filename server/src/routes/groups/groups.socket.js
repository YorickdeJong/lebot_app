const { getUsersInGroup } = require('../groups/groupsInfo.controller');
const { getGroupsPerClassRoom } = require('../groups/groups.controller');

const pool = require('../../services/postGreSQL');


function listenToClientGroups(io) {
    const groupsNamespace = io.of('/api/v1/groups');
  
    // Stores the cleanupNotificationListener functions for each school
    const cleanupFunctions = {};
  
    // Stores the database clients for each school
    const schoolClients = {};
  
    // Tracks the number of connected users for each school
    const schoolUserCounts = {};
  
    groupsNamespace.on('connection', async (socket) => {
      console.log('Client connected to groups');
  
      let school_id;
  
      socket.on('initialize', async ({ user_id, classroom_id, schoolId }) => {
        // add this user to the room corresponding to their school
        socket.join(`school-${schoolId}`);
        school_id = schoolId;
  
        // increment the number of connected users for this school
        schoolUserCounts[school_id] = (schoolUserCounts[school_id] || 0) + 1;
  
        // Establish a new database connection for this school if it doesn't exist
        if (!schoolClients[school_id]) {
            const client = await pool.connect();
            schoolClients[school_id] = client;
            cleanupFunctions[school_id] = await setupNotificationListener(client, classroom_id, school_id, groupsNamespace);
        }
      });
  
      socket.on('disconnect', () => {
        console.log('Client disconnected from groups');
  
        // decrement the number of connected users for this school
        schoolUserCounts[school_id]--;
  
        // if no more users are connected for this school, cleanup
        if (schoolUserCounts[school_id] === 0) {
            if (cleanupFunctions[school_id]) {
                cleanupFunctions[school_id]();
            }
            delete schoolClients[school_id];
            delete cleanupFunctions[school_id];
        }
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





// function listenToClientGroups(io) {
//   const groupsNamespace = io.of('/api/v1/groups');

//   // Stores the cleanupNotificationListener functions for each school
//   const cleanupFunctions = {};

//   // Stores the database clients for each school
//   const schoolClients = {};

//   // Tracks the number of connected users for each school
//   const schoolUserCounts = {};

//   groupsNamespace.on('connection', async (socket) => {
//     console.log('Client connected to groups');

//     let school_id;

//     socket.on('initialize', async ({ user_id, classroom_id, schoolId }) => {
//       // add this user to the room corresponding to their school
//       socket.join(`school-${schoolId}`);
//       school_id = schoolId;

//       // increment the number of connected users for this school
//       schoolUserCounts[school_id] = (schoolUserCounts[school_id] || 0) + 1;

//       // Establish a new database connection for this school if it doesn't exist
//       if (!schoolClients[school_id]) {
//           const client = await pool.connect();
//           schoolClients[school_id] = client;
//           cleanupFunctions[school_id] = await setupNotificationListener(client, classroom_id, school_id, groupsNamespace);
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log('Client disconnected from groups');

//       // decrement the number of connected users for this school
//       schoolUserCounts[school_id]--;

//       // if no more users are connected for this school, cleanup
//       if (schoolUserCounts[school_id] === 0) {
//           if (cleanupFunctions[school_id]) {
//               cleanupFunctions[school_id]();
//           }
//           delete schoolClients[school_id];
//           delete cleanupFunctions[school_id];
//       }
//     });
//   });


//   async function setupNotificationListener(client, classroom_id, school_id, groupsNamespace) {
//     await client.query('LISTEN groups_channel');

//     client.on('notification', async (msg) => {
//       if (!classroom_id || !school_id) {
//         return;
//       }

//       const fetchedData = await getGroupsPerClassRoom(client, classroom_id, school_id);

//       console.log('fetchedData', fetchedData);

//       if (fetchedData.status === 404 || fetchedData.status === 500) {
//         console.log(fetchedData.message);
//         console.log('setupNotificationListener groups data is empty, returning []');
//         groupsNamespace.emit('fetch-data-update', []);
//         return;
//       }

//       const updatedData = await Promise.all(
//         fetchedData.data.map(async (item) => {
//             const countData = await getUsersInGroup(client, item.group_id);
//             return { ...item, current_count: countData.count };
//         })
//       );

//       groupsNamespace.to(`school-${school_id}`).emit('fetch-data-update', updatedData);
//     });

//     return () => {
//         console.log('Releasing client');
//         client.release();
//     };
//   }
// }


module.exports = { listenToClientGroups };





// const { getUsersInGroup } = require('../groups/groupsInfo.controller');
// const { getGroupsPerClassRoom } = require('../groups/groups.controller');

// const pool = require('../../services/postGreSQL');

