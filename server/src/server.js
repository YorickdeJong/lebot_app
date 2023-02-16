const fs = require('fs');
const https = require('https');
const http = require('http');
const app = require('./app');
const path = require('path');

const PORT = 3000

// const server = https.createServer({
//     key: fs.readFileSync(__dirname + '/keys/key.pem'), //need a key to and a certificate
//     cert: fs.readFileSync(__dirname + '/keys/cert.pem'),
// }, app)

const server = http.createServer(app)

async function startServer() {
    server.listen(PORT, () => {
        console.log(`listening on port ${PORT}...`)
    })
}

startServer()