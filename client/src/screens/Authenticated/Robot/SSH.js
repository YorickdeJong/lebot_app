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
    


    // useEffect(() => {
    //     function setDir() {
    //         setLoading(true)
    //         if (socketCtx.isConnected && socketCtx) {
    //             console.log('check')
    //             socketCtx.Command('dir', 'dir')
    //             console.log('check 1')
    //             setLoading(false)
    //         }
    //         else {
    //             console.log('failed to set dir')
    //             setLoading(false)
    //         }
    //     }
    //     setDir()
    // }, [socketCtx.isConnected])

    // useEffect(() => {
    //     socketCtx.Command('dir', 'dir')
    // }, [socketCtx.output])
    
    const handleConnect = (inputType, input) => {
        switch(inputType) {
            case 'disconnect': 
                socketCtx.Disconnect()
                break;
            case 'connect': 
                socketCtx.Connect(input);
                break;
        }
        
    }

    if (loading) {
        return <LoadingOverlay message='Loading results'/>
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
