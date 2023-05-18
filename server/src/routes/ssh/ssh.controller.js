

//--------------- Connect to external device -----------------//
async function connectToRemoteDevice(sshConfig, socket, sshClient) {

    try {
        // check if connection is active
        if (sshClient){
            await new Promise((resolve, reject) => {
            sshClient.on('ready', () => {
                console.log('SSH connection established Backend');
                socket.emit('sshConnectionStatus', { connected: true, message: 'Verbonden met de robot' });
                resolve();
            });
            sshClient.on('error', (err) => {
                console.error('SSH connection error:', err);
                socket.emit('sshConnectionStatus', { connected: false, message: 'Kan niet verbinden met robot, ben je verbonden met de robots wifi netwerk?' });
                reject(err);
            });
            sshClient.connect(sshConfig);
        })
    }}
    catch (err) {
        console.error('Failed to establish SSH connection:', err);
        socket.emit('sshConnectionStatus', { connected: false, message: 'Kan niet verbinden met robot, ben je verbonden met de robots wifi netwerk?' });
    }
}

async function runCommandOnRemoteDeviceInternal(command, sshClient, socket) {
    let commandStatus = false;
    console.log('CHECK EXECUTION')
    const output = await new Promise((resolve, reject) => {
        sshClient.shell('bash', (err, stream) => {
            if (err) {
                reject(err);
                socket.emit('sshConnectionStatus', { connected: false, message: 'Starten van robot is niet gelukt' });
                return;
            }
            
            socket.on('driveCommand', (data) => {
                console.log('Drive Command', data.command)
                stream.write(data.command + '\n');
            })

            let output = '';
            let checkOutputReceived = false;
            
            stream.on('data', (data) => {
                output += data.toString();
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
                socket.emit('sshConnectionStatus', { connected: false, message: `Command '${command}' execution error` });
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
    const pathToExternalScript = data;
    try {
        const output = await new Promise((resolve, reject) => {
            sshClient.exec(pathToExternalScript, (err, stream) => {
                if (err) {
                    reject(err);
                    return;
                }

                let output = '';
                stream.on('data', (data) => {
                    output += data.toString();
                });
                stream.on('end', () => {
                    resolve(output);
                });
                stream.on('error', (err) => {
                    console.error('Failed to start script on remote device:', err);
                    reject(err);
                });
            });
        });

        return output;
    } catch (err) {
        console.error('Failed to start script on remote device:', err);
        // handle the error appropriately, e.g., you could throw the error again or return a default value
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
  startScriptOnRemoteDevice,
  streamOutputToSocket,
};
