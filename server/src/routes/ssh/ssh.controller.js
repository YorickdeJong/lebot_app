

//--------------- Connect to external device -----------------//
async function connectToRemoteDevice(sshConfig, socket, sshClient) {

    try {
        // check if connection is active
        if (sshClient){
            await new Promise((resolve, reject) => {
            sshClient.on('ready', () => {
                console.log('SSH connection established Backend');
                socket.emit('sshConnectionStatus', { connected: true, message: 'SSH connection established' });
                resolve();
            });
            sshClient.on('error', (err) => {
                console.error('SSH connection error:', err);
                socket.emit('sshConnectionStatus', { connected: false, message: 'Failed to establish SSH connection' });
                reject(err);
            });
            sshClient.connect(sshConfig);
        })
    }}
    catch (err) {
        console.error('Failed to establish SSH connection:', err);
        socket.emit('sshConnectionStatus', { connected: false, message: 'Failed to establish SSH connection' });
    }
}


async function runCommandOnRemoteDeviceInternal(command, sshClient) {
    let commandStatus = false;
    const output = await new Promise((resolve, reject) => {
        sshClient.exec(command, (err, stream) => {
        if (err) {
            reject(err);
        }

        // TODO add a try except here sucht that a message is sent to the front end containing a boolean,
        // This value tells if the command went through correctly -> front end prints alert if command is incorrect
        let output = '';
        try{ 
            stream.on('data', (data) => {
                output += data.toString();
            });
            commandStatus = true
            console.log('Command succeeded')
        }
        catch(err){
            console.log('command failed')
            commandStatus = false
        }
        stream.on('end', () => {
            // console.log(`Command '${command}' output: ${output}`);
            resolve(output);
        });
        stream.on('error', (err) => {
            console.error(`Command '${command}' error:`, err);
            reject(err);
        });
        });
    });

    const data = {
        output: output, 
        commandStatus: commandStatus
    }

    return data;
}


//--------------- Start specific script on external device -----------------//
async function startScriptOnRemoteDevice(data, sshClient) {
    const pathToExternalScript = data
    const output = await new Promise((resolve, reject) => {
        sshClient.exec(pathToExternalScript, (err, stream) => {
        if (err) {
            reject(err);
        }

        let output = '';
        stream.on('data', (data) => {
            output += data.toString();
        });
        stream.on('end', () => {
            console.log(`Script output: ${output}`);
            resolve(output);
        });
        stream.on('error', (err) => {
            console.error('Failed to start script on remote device:', err);
            reject(err);
        });
        });
    });

    return output;
}

//--------------- Disconnect from external device -----------------//
async function disconnectFromRemoteDevice(sshClient) {
  try {
    if (sshClient) {
      sshClient.end();
      sshClient = null;
      console.log('SSH connection closed');
    } else {
      console.log('No active connection');
    }
  }
  catch (err) {
    console.error('Failed to close SSH connection:', err);
  }
}

//--------------- Socket Related Script on External Device -----------------//
function streamOutputToSocket(socket, output) {
    const lines = output.trim().split('\n');

    for (let line of lines) {
        socket.emit('output', { output: line });
    }
}

module.exports = {
  connectToRemoteDevice,
  runCommandOnRemoteDeviceInternal,
  disconnectFromRemoteDevice,
  startScriptOnRemoteDevice,
  streamOutputToSocket,
};
