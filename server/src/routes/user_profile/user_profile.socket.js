
const pool = require('../../services/postGreSQL');
const { getUsersInGroup } = require('./user_profile.controller');
 
async function listenToClientUser(io) {
    const userNamespace = io.of("/api/v1/user/users-in-group");
    let connectionCount = 0;
    
    
    userNamespace.on("connection", async (socket) => {
        console.log("Client connected to USER");
        const client = await pool.connect(); // Create a single client connection for all requests
        
        let group_ids;
        let cleanupNotificationListener = await setupNotificationListener(client);
        
        async function setupNotificationListener(client) {
            await client.query("LISTEN user_profile_channel");
    
            client.on("notification", async (msg) => {
                if (!group_ids) {
                    return;
                }

                const results = await Promise.all(
                    group_ids.map(async (group_id) => {
                        const result = await getUsersInGroup(client, group_id); // Pass the client connection to the getUsersInGroup function
                        console.log("users in group", result);
                        if (result.status === 200) {
                            const names = result.data.map((user) => user.name);
                            return { group_id, names };
                        }
                        else {
                            return { group_id, names: [] };
                        }
                    })
                );
        
                userNamespace.emit("fetch-data-update", results);
            });
    
            return () => {
                console.log("Releasing client");
                client.release();
            };
        }
    
        socket.on("initialize", async ({ group_ids: groupIds }) => {
            console.log('=====================')
            console.log('GROUP IDS', groupIds)
            group_ids = groupIds;
            if (!group_ids) {
                return;
            }
            const results = await Promise.all(
                group_ids.map(async (group_id) => {
                    const result = await getUsersInGroup(client, group_id); // Pass the client connection to the getUsersInGroup function
                    console.log("users in group", result);
                    if (result.status === 200) {
                        const names = result.data.map((user) => user.name);
                        return { group_id, names };
                    } 
                    else {
                        return { group_id, names: [] };
                    }
                })
            );
            userNamespace.emit("fetch-data-update", results);  
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
    listenToClientUser,
};
