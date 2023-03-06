const sshController = require('./ssh.controller')
let activeStream = null;

function listenToClientSSH(io, sshClient) {

    io.on('connection', (socket) => {
        console.log('Client connected');
    
        socket.on('disconnected', () => {
            console.log('Client disconnected');
            sshController.disconnectFromRemoteDevice(sshClient);
        });
    
        socket.on('connectToRemoteDevice', async (config) => {
            
            if (sshClient && sshClient.ready) {
                console.log('SSH connection already established');
                socket.emit('sshConnectionStatus', { message: 'SSH connection already established' });
                return;
            }
            try {
                await sshController.connectToRemoteDevice(config, socket, sshClient);
                console.log('SSH connection established');
                socket.emit('sshConnectionStatus', { connected: true });
            } 
            catch (err) {
                console.error('Failed to establish SSH connection:', err);
                socket.emit('sshConnectionStatus', { connected: false });
            }
        
        });
    
        socket.on('command', async (data) => {

            if (!sshClient || !sshClient._sock.readable) {
                console.log('SSH connection not established');
                socket.emit('scriptStatus', { message: 'SSH connection not established' });
                return;
            }
            try {
                const activeStream = await sshController.runCommandOnRemoteDeviceInternal(data.command, sshClient, socket);
                socket.emit('output', { activeStream });
            } 
            catch (err) {
                console.error('Failed to run command on remote device:', err);
                socket.emit('error', { message: 'Failed to run command on remote device' });
            }
        });
    
        socket.on('runScript', async (data) => {
            if (!sshClient || !sshClient._sock.readable) {
                console.log('SSH connection not established');
                socket.emit('scriptStatus', { message: 'SSH connection not established' });
                return;
            }
            try {
                const scriptOutput = await sshController.startScriptOnRemoteDevice(data.file, sshClient);
                console.log('Script started on remote device');
                sshController.streamOutputToSocket(socket, scriptOutput);
            } 
            catch (err) {
                console.error('Failed to start script on remote device:', err);
                socket.emit('error', { message: 'Failed to start script on remote device' });
            }
        });

        socket.on('input', (data) => {
            if (activeStream) {
                activeStream.write(data + '\n');
            }
        });
    });
}    


module.exports = {
    listenToClientSSH
}