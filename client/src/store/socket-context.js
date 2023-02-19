import { createContext, useState, useEffect } from "react";
import {Alert} from 'react-native'

import io from 'socket.io-client';
export const SocketContext = createContext({
    socket: null,
    output: '',
    dir: '',
    isConnected: false,
    CreateSocketConnection: (socket) => {},
    Connect: () => {},
    Disconnect: () => {},
    responseOutput: (output) => {},
    responseDir: (dir) => {}
})



function SocketContextProvider({children}) {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [output, setOutput] = useState('');
    const [dir, setDir] = useState(' root');

    const SOCKET_SERVER_URL = 'http://10.7.191.114:3000'
    
    function CreateSocketConnection() {
        setSocket(io(SOCKET_SERVER_URL))
    }

    function Connect(config) {
        try{
            socket.emit('connectToRemoteDevice',  config );
            
        }
        catch(error) {
            console.log(error);
            setOutput('Connection Failed')
            
        }
    }

    function Disconnect() {
        try{
            socket.emit('disconnected');
            setIsConnected(false);
            
        }
        catch(error) {
            console.log(error);
            setOutput('Failed to disconnect')
            
        }
    }

    function Command(inputType, command) {
        try {
            socket.emit('command', {command: command}) //TODOProblem
            socket.on('output', (data) => {
                if (data.activeStream.commandStatus) {
                    switch(inputType) {
                        case 'cd':
                            if (command.startsWith('cd ')) {
                                command = command.substring(3, command.length)
                            }
                            setDir(' root/' + command);
                            break;
                        case 'cdBack': 
                            if (command.startsWith('cd ')) {
                                command = command.substring(3, command.length)
                            }ç
                            setDir(' root/' + command);
                            break;
                        case 'mkdir':
                            setOutput('new directory created');
                            break;
                        case 'dir':
                            setOutput(data.activeStream.output)
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

    useEffect( () => {
        setDir(' root')
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
                setIsConnected(data.connected);
            }
            });

        };
    }, [socket]);

    const value = {
        socket: socket,
        output: output,
        dir: dir, 
        isConnected: isConnected,
        CreateSocketConnection: CreateSocketConnection,
        Connect: Connect,
        Disconnect: Disconnect,
        Command: Command,
        responseOutput: responseOutput,
        responseDir: responseDir
    } 

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export default SocketContextProvider