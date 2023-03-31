import { createContext, useState, useEffect, useRef } from "react";
import {Alert} from 'react-native'

import io from 'socket.io-client';
export const SocketContext = createContext({
    socket: null,
    output: '',
    dir: '',
    isConnected: false,
    os: '',
    isLoading: false, 
    power: false,
    isMeasurementStarted: false,
    CreateSocketConnection: (socket) => {},
    Connect: () => {},
    Disconnect: () => {},
    Command: (input, command) => {},
    responseOutput: (output) => {},
    responseDir: (dir) => {},
    OS: (os) => {},
    Loading: (loading) => {},
    setIsMeasurementStarted: (isMeasurementStarted) => {},
})

//N.B. EVERY COMPONENT THAT USES SOCKET WILL NEED TO BE WRAPPED IN A REACT.MEMO, OTHERWISE IT WILL CAUSE LARGE AMOUNTS OF UNNECESSARY RERENDERS

function SocketContextProvider({children}) {
    // const [socket, setSocket] = useState(null);
    const socket = useRef(null); //use useRef to not trigger a rerender
    const [isConnected, setIsConnected] = useState(false);
    const [output, setOutput] = useState('');
    const [dir, setDir] = useState('');
    const [os, setOs] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [power, setPower] = useState(false); 
    const [isMeasurementStarted, setIsMeasurementStarted] = useState(false);

    const SOCKET_SERVER_URL = 'http://10.7.191.114:3000' // iphone: 'http://172.20.10.2:3000'
    

    // Call CreateConnection on mount
    useEffect(() => {
        console.log(`check connection 1`)
        CreateSocketConnection();
    }, []);
    
    useEffect( () => {
        console.log(`check connection 1`)
        setDir('')
        setIsConnected(false);
    }, [])

    useEffect(() => {
        console.log(`check connection 1`)
        if(isConnected) {
            Command('dir', 'dir')
        }

    }, [isConnected])

    const renderCount = useRef(0);
    useEffect(() => {
        renderCount.current += 1;
        console.log(`SocketContextProvider has rendered ${renderCount.current} times`);
    });

    //Sockets have to be app state wide 
    useEffect(() => {
        console.log(`check connection 1`)
        if (socket.current) {
            socket.current.on('connection', () => {
                console.log('Connected to server');
                });

                socket.current.on('sshConnectionStatus', (data) => {
                    if (data && data.connected) {
                        console.log('SSH connection established Frontend');
                        if (socket.current.connected){
                            setIsConnected(data.connected);
                        }
                    } 
                    else {
                        console.error('Failed to establish SSH connection');
                        Disconnect();
                    }
                });
            if (!isMeasurementStarted){
                listenForStartScript();
            }
        };
        
    }, []);

    function CreateSocketConnection() {
        socket.current = (io(SOCKET_SERVER_URL))
    }

    function Connect(config, callback) {
        try{
            socket.current.emit('connectToRemoteDevice',  config );
            
        }
        catch(error) {
            console.log(error);
            setOutput('Connection Failed')
            
        }

        if(callback) {
            callback()
        }
    }
    
    function Disconnect() {
        if (isConnected) {
            try{
                socket.current.emit('disconnected');
                setIsConnected(false);
                
            }
            catch(error) {
                console.log(error);
                setOutput('Failed to disconnect')
                
            }
        }
    }

    function listenForStartScript() { //in useEffect in chartContext
        if (!isMeasurementStarted){
            socket.current.on('measurementStarted', (data) => {
                console.log(`DATA MESSAGE: ${data.message}`)
                if(data.message === 'Measurement started') {
                    console.log('Measurement Started, DATA RECEIVED')
                    setIsMeasurementStarted(true)
                }
            }) 
        }
    }

    function Command(inputType, command) {
        try {
            socket.current.emit('command', {command: command}) //TODOProblem
            socket.current.on('terminalOutput', (data) => {
                if (data) {
                    switch(inputType) {
                        case 'cd' || 'cdBack':
                            if (data.data.includes('@') && 
                                data.data.includes(':') && 
                                data.data.includes(':')){
                                setDir(data.data);
                            }
                            break;

                        case 'mkdir':
                            setOutput('new directory created');
                            break;

                        case 'dir' || 'roslaunch':
                            if ((!data.data.includes('@') && 
                                !data.data.includes(':') && 
                                !data.data.includes(':')) &&
                                !data.data.includes('cd ')&&
                                !data.data.includes('dir') &&
                                data.data){
                                setOutput(data.data) 
                            }
                            break;
                    }
                }
                else {
                    Alert.alert('Incorrect command, Please try again');
                    return;
                }
            })
        }
        catch (err) {
            console.log(`Failed to send command: ${err}`)
            responseOutput('Error: ' + err.message)
            socket.current(null) // Reset socket to trigger reconnection
            setIsConnected(false);
            Alert.alert('You have been disconnected from the ssh connection')
        };
        
    }


    function responseOutput(response){
        setOutput(response);
    }

    function responseDir(dir){
        setDir(dir);
    }

    function OS(os) {
        setOs(os)
    }

    function Loading(loading) {
        setIsLoading(loading)
    }

    
    console.log(`check rerender`)

    const value = {
        socket: socket,
        output: output,
        dir: dir, 
        isConnected: isConnected,
        os: os,
        isLoading: isLoading,
        power,
        isMeasurementStarted,
        CreateSocketConnection: CreateSocketConnection,
        Connect: Connect,
        Disconnect: Disconnect,
        Command: Command,
        responseOutput: responseOutput,
        responseDir: responseDir,
        OS: OS,
        Loading: Loading,
        setPower,
        setIsMeasurementStarted,
    } 

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export default SocketContextProvider