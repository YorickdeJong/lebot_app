// const pool = require('../../services/postGreSQL')
// const {
//     getAllAssignmentsQuery,
// } = require('./../../services/queries/queryAssignment')

// async function listenToClientAssignment(io) {
//     const client = await pool.connect();
//     const assignmentData = await client.query(getAllAssignmentsQuery)


//     io.on('connection', (socket) => {
//         socket.emit('assignment_data', assignmentData.rows)
//         .catch(error => {
//             console.log(`Error in sockt: ${error}`)
//         })
//     })
    
// }


// export default listenToClientAssignment