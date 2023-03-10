
import SSHForm from "./sshForm";
import React, { useState, useContext } from 'react';
import {  Alert } from 'react-native';
import { SocketContext } from "../../store/socket-context";

function SSHCredentials({handleConnect, serverOutput}) {
    const socketCtx = useContext(SocketContext);

    // ssh connection
    const [ipAddress, setIpAddress] = useState('192.168.1.22');
    const [username, setUsername] = useState('ubuntu');
    const [password, setPassword] = useState('password');

    const [credentialsInvalid, setCredentialsInvalid] = useState({
        checkIP: false,
        checkUsername: false,
        checkPassword: false,
    })

    const handleExecuteCommand = async (inputType) => {
        socketCtx.Loading(true);
        if (!socketCtx.isConnected) {
            let checkIP = ipAddress.length >= 12 && ipAddress.includes('.');
            let checkUsername = username.length > 0;
            let checkPassword = password.length > 0;
    
    
            if (!checkIP || !checkUsername || !checkPassword ){
                Alert.alert('Incorrect credentials, please fill in the correct ones')
                setCredentialsInvalid({
                    checkIP: !checkIP,
                    checkUsername: !checkUsername,
                    checkPassword: !checkPassword
                })
                return;
            }
    
            const config = {
                host: ipAddress,
                port: 22,
                username: username,
                password: password,
            }

            switch(inputType) {
                case 'windows':
                    socketCtx.OS(inputType);
                    break;
                case 'linux':
                    socketCtx.OS(inputType);
                    break;
            }
            handleConnect(config);
        }
        else {
            handleConnect();
            socketCtx.emit('endStream')
        }
    }

    return (
        <SSHForm 
        handleExecuteCommand={handleExecuteCommand}
        setIpAddress={setIpAddress}
        setUsername={setUsername}
        setPassword={setPassword}
        ipAddress={ipAddress}
        username={username}
        password={password}
        credentialsInvalid={credentialsInvalid}
        serverOutput={serverOutput}/>
    )
}

export default SSHCredentials