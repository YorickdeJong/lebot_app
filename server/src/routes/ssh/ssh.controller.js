

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

async function runCommandOnRemoteDeviceInternal(command, sshClient, socket) {
    let commandStatus = false;
    const output = await new Promise((resolve, reject) => {
        sshClient.shell('bash', (err, stream) => {
            if (err) {
                reject(err);
            }
            
            socket.on('driveCommand', (data) => {
                console.log(`Received Command: ${data.command}`)
                stream.write(data.command + '\n');
            })

            let output = '';
            let checkOutputReceived = false;
            stream.on('data', (data) => {
                output += data.toString();
                console.log(`Command '${command}' output: ${output}`);
                //check either if measurement has started or if the robot connected to the wifi
                if (!checkOutputReceived){
                    checkWifiConnected = output.includes("reboot system")
                    checkWifiAvailable = output.includes("ssid not found")
                    checkPasswordCorrect = output.includes("password incorrect")
                    checkOutputReceived = output.includes("MEASUREMENT STARTED CONNECTION DATABASE ACTIVE")
                    
                    if (checkOutputReceived){
                        console.log('check')
                        socket.emit('measurementStarted', { message: 'Measurement started' });
                    }
                    if (checkWifiConnected){
                        console.log('Wifi connected')
                        socket.emit('robotConnected', { message: 'Robot connected'})
                    }
                    if (checkWifiAvailable){
                        console.log('Wifi NOT connected')
                        socket.emit('robotConnected', { message: 'Wifi incorrect'})
                    }
                    if (checkPasswordCorrect){
                        console.log('Password incorrect')
                        socket.emit('robotConnected', { message: 'Password incorrect'})
                    }
                }
                
                socket.emit('terminalOutput', { data: data.toString()});
                commandStatus = true;
            });
            
            stream.on('close', (code) => {
                console.log(`Command '${command}' output: ${output}`);
                commandStatus = true;
                resolve(output);
            });

            stream.on('endStream', () => {
                console.log('ENDED STREAM');
                resolve(output);
            });

            stream.on('error', (err) => {
                console.error(`Command '${command}' error:`, err);
                reject(err);
            });

            stream.write(command + '\n');
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
