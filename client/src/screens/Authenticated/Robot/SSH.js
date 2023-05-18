import React, { useState, useEffect, useContext } from 'react';
import SSHCredentials from '../../../components/robot/sshCredentials';
import { SocketContext } from '../../../store/socket-context';
import LoadingOverlay from '../../../components/UI/LoadingOverlay'


const SSHConnectionScreen = () => {
    const socketCtx = useContext(SocketContext);

    console.log(`CHECK SCREEN SSH`)
    const handleConnect = (inputType, input) => {
        switch(inputType) {
            case 'disconnect': 
                break;
            case 'connect': 
                socketCtx.Connect(input);
                break;
        }
    
    } 

    return (
        <SSHCredentials
        handleConnect={handleConnect.bind(this, inputBind)}
        serverOutput={socketCtx.output}
        />
    );
};

export default React.memo(SSHConnectionScreen)
