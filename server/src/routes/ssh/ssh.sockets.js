const sshController = require('./ssh.controller')
let activeStream = null;

function listenToClientSSH(io, sshClients, Client) {
    let sshConfigs = new Map();

    io.on('connection', (socket) => {
        let sshClient = new Client();
        sshClients.set(socket.id, sshClient);

        console.log('Client connected');
        console.log('socket id: ', socket.id);


        socket.on('disconnect', () => {
            try {
                console.log('Client disconnected in DISCONNECT');
                sshClient = sshClients.get(socket.id);
                if (sshClient) {
                    sshClient.end();
                    sshConfigs.delete(socket.id);
                    sshClients.delete(socket.id);
                    console.log('deleted socket', socket.id);
                    console.log('SSH connection closed');
                    socket.emit('sshConnectionStatus', { connected: false });
                } 
                else {
                    console.log('No active connection');
                }
            }
            catch (error) {
                console.log('failed to disconnect socket')
                console.log(error);
            }
        }); 
                
        // Inside your listenToClientSSH function
        socket.on('connectToRemoteDevice', async (config) => {

            sshConfigs.set(socket.id, config);

            try {
                // If the SSH client is ready, no need to connect again
                if (sshClient && sshClient.ready) {
                    console.log('SSH connection already established');
                    socket.emit('sshConnectionStatus', { message: 'SSH connection already established' });
                    socket.emit('sshConnectionStatus', { connected: true });
                    return;
                }

                // Try to establish the SSH connection
                await sshController.connectToRemoteDevice(config, socket, sshClient);
                console.log('SSH connection established to remote device');
                socket.emit('sshConnectionStatus', { connected: true });
            } 
            catch (err) {
                console.error('Failed to establish SSH connection:', err);
                socket.emit('sshConnectionStatus', { connected: false, message: err.message });
            }
        });
    
        socket.on('command', async (data) => {
            try {
                sshClient = sshClients.get(socket.id);
                if (!sshClient || !sshClient._sock || !sshClient._sock.readable) {
                    console.log('SSH connection not established Command');
                    socket.emit('sshConnectionStatus', {connected: false,  message: 'SSH connection not established Command' });
                    return;
                }
                const activeStream = await sshController.runCommandOnRemoteDeviceInternal(data.command, sshClient, socket);
                socket.emit('output', { activeStream });
                socket.emit('sshConnectionStatus', {connected: true,  message: 'SSH connection established Command' });
            } 
            catch (err) {
                console.error('Failed to run command on remote device:', err);
                socket.emit('sshConnectionStatus', { connected: false, message: 'Failed to run command on remote device' });
            }
        });


        socket.on('retrySSHConnection', async () => {
            try {
                // Get the SSH configuration
                const savedConfig = sshConfigs.get(socket.id);
                if (!savedConfig) {
                    throw new Error('No SSH configuration found for this socket');
                }
                await sshController.connectToRemoteDevice(savedConfig, socket, sshClient);
                console.log('SSH connection established to remote device');
                socket.emit('sshConnectionStatus', { connected: true });
            } catch (err) {
                console.error('Failed to establish SSH connection:', err);
                socket.emit('sshConnectionStatus', { connected: false, message: err.message });
            }
        });

        socket.on('input', (data) => {
            let activeStream = activeStreams.get(socket.id);
            if (activeStream) {
                activeStream.write(data + '\n');
            }
        });
    });
}


module.exports = {
    listenToClientSSH
}