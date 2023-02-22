import React, { useState, useEffect, useContext } from 'react';
import SSHCredentials from '../../../components/robot/sshCredentials';
import { SocketContext } from '../../../store/socket-context';
import LoadingOverlay from '../../../components/UI/LoadingOverlay'


const SSHConnectionScreen = () => {
    const socketCtx = useContext(SocketContext);
    const [loading, setLoading] = useState(false);

    // Call CreateConnection on mount
    useEffect(() => {
        socketCtx.CreateSocketConnection();
    }, []);

    const handleConnect = (inputType, input) => {
        switch(inputType) {
            case 'disconnect': 
                socketCtx.Disconnect(() => {
                    socketCtx.Loading(false)
                })
                break;
            case 'connect': 
                socketCtx.Connect(input);
                break;
        }
    
    }


    const inputBind = socketCtx.isConnected ? 'disconnect' : 'connect' 

    return (
        <SSHCredentials
        handleConnect={handleConnect.bind(this, inputBind)}
        serverOutput={socketCtx.output}
        />
    );
};

export default SSHConnectionScreen
