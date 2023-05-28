const http = require('http');
const app = require('./app');
const socketMeasurementResults = require('./routes/measurement_results/measurementResults.socket')
const socketPowerMeasurement = require('./routes/power_measurement/powerMeasurement.socket')
const socketGroups = require('./routes/groups/groups.socket')
const socketClasses = require('./routes/classes/classes.socket')
const socketTimer = require('./routes/time_lessons/time_lessons.socket')

const io = require('socket.io')
const PORT = process.env.PORT || 3001;


// const server = https.createServer({
//     key: fs.readFileSync(__dirname + '/keys/key.pem'), //need a key to and a certificate
//     cert: fs.readFileSync(__dirname + '/keys/cert.pem'),
// }, app)



//Create Server
const server = http.createServer(app)

//Initiate Socket
const ioConnect = io(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})


//Start Server and socket
async function startServer() {
    
    server.listen(PORT, (w) => {
        console.log(`listening on port ${PORT}...`)
    })
}

startServer()
module.exports = startServer; // Export the startServer function for testing purposes

socketPowerMeasurement.listenToClientPower(ioConnect);
socketMeasurementResults.listenToClientMeasurementResults(ioConnect);
socketGroups.listenToClientGroups(ioConnect);
socketClasses.listenToClientClasses(ioConnect);
socketTimer.listenToClientTimeLessons(ioConnect);