const { Pool } = require('pg');
const pool = new Pool({
    // Your database configuration here
});

//-------------------Create Socket for images such that they are directly updated in the app from the database --------------------//

function listenToClientImages(io) {
    io.on('connection', socket => {
        socket.on('getImages', async ({ user_profile_id, assignment_number, title }) => {
            const client = await pool.connect();
    
            try {
                const user_profile_id = parseInt(user_profile_id);
                const assignment_number = parseInt(assignment_number);
                const { rows } = await client.query(getImageQuery, [assignment_number, user_profile_id, title]);
                console.log(rows);
                console.log(user_profile_id + " " + assignment_number);
    
                if (rows.length === 0) {
                    socket.emit('error', { message: 'Images for specific assignment do not exist' });
                } else {
                    socket.emit('images', rows);
                }
            } catch (error) {
                console.log(error);
                socket.emit('error', { message: 'Error trying to get image data' });
            } finally {
                client.release();
            }
        });
    });
}


module.exports = {
    listenToClientImages
}