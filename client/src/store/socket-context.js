import { createContext, useState, useEffect } from "react";
import {Alert} from 'react-native'

import io from 'socket.io-client';
export const SocketContext = createContext({
    socket: null,
    output: '',
    dir: '',
    isConnected: false,
    os: '',
    isLoading: false, 
    CreateSocketConnection: (socket) => {},
    Connect: () => {},
    Disconnect: () => {},
    Command: (input, command) => {},
    responseOutput: (output) => {},
    responseDir: (dir) => {},
    OS: (os) => {},
    Loading: (loading) => {}
})



function SocketContextProvider({children}) {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [output, setOutput] = useState('');
    const [dir, setDir] = useState('');
    const [os, setOs] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const SOCKET_SERVER_URL = 'http://172.20.10.2:3000'
    
    function CreateSocketConnection() {
        setSocket(io(SOCKET_SERVER_URL))
    }

    function Connect(config, callback) {
        try{
            socket.emit('connectToRemoteDevice',  config );
            
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
                socket.emit('disconnected');
                setIsConnected(false);
                
            }
            catch(error) {
                console.log(error);
                setOutput('Failed to disconnect')
                
            }
        }
    }

    function Command(inputType, command) {
        try {
            socket.emit('command', {command: command}) //TODOProblem
            socket.on('terminalOutput', (data) => {
                if (data) {
                    console.log(data.data)
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
            setSocket(null) // Reset socket to trigger reconnection
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

    useEffect( () => {
        setDir('')
        setIsConnected(false);
    }, [])

    useEffect(() => {
        if(isConnected) {
            Command('dir', 'dir')
        }

    }, [isConnected])

    //Sockets have to be app state wide 
    useEffect(() => {
        if (socket) {
           socket.on('connection', () => {
                console.log('Connected to server');
            });

            socket.on('sshConnectionStatus', (data) => {
            if (data && data.connected) {
                console.log('SSH connection established Frontend');
                setIsConnected(data.connected)
            } 
            else {
                console.error('Failed to establish SSH connection');
                Disconnect();
            }
            });

        };
    }, [socket]);

    const value = {
        socket: socket,
        output: output,
        dir: dir, 
        isConnected: isConnected,
        os: os,
        isLoading: isLoading,
        CreateSocketConnection: CreateSocketConnection,
        Connect: Connect,
        Disconnect: Disconnect,
        Command: Command,
        responseOutput: responseOutput,
        responseDir: responseDir,
        OS: OS,
        Loading: Loading,
    } 

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export default SocketContextProvider