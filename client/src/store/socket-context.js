import { createContext, useState, useEffect, useRef, useContext } from "react";
import {AppState, Alert} from 'react-native'

import io from 'socket.io-client';
import { fullIpAddressRaspi, ipAddressComputer, ipAddressRaspberryPi } from "../data/ipaddresses.data";
import { set } from "react-native-reanimated";
import { UserProfileContext } from "./userProfile-context";
export const SocketContext = createContext({
    socket: null,
    output: '',
    dir: '',
    isConnected: false,
    isConnectedViaSSH: false,
    os: '',
    isLoading: false, 
    power: false,
    isMeasurementStarted: false,
    robotConnectedToWifi: false,
    scriptCommand: '',
    setScriptCommand: (script) => {},
    CreateSocketConnection: (socket) => {},
    Disconnect: () => {},
    Command: (input, command) => {},
    responseOutput: (output) => {},
    responseDir: (dir) => {},
    OS: (os) => {},
    Loading: (loading) => {},
    setIsMeasurementStarted: (isMeasurementStarted) => {},
    EstablishSocketConnection: () => {},
})

//N.B. EVERY COMPONENT THAT USES SOCKET WILL NEED TO BE WRAPPED IN A REACT.MEMO, OTHERWISE IT WILL CAUSE LARGE AMOUNTS OF UNNECESSARY RERENDERS

function SocketContextProvider({children}) {
    // const [socket, setSocket] = useState(null);
    const socket = useRef(null); //use useRef to not trigger a rerender
    const [scriptCommand, setScriptCommand] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isConnectedViaSSH, setIsConnectedViaSSH] = useState(false);
    const output = useRef('');
    const dir = useRef('');
    const [os, setOs] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [power, setPower] = useState(false); 
    const [isMeasurementStarted, setIsMeasurementStarted] = useState(false);
    const [isAlertShown, setIsAlertShown] = useState(false);
    const userprofileCtx = useContext(UserProfileContext);
    const user_id = userprofileCtx.userprofile.id;
    const startCommandSent = useRef(false);
    const SOCKET_SERVER_URL = fullIpAddressRaspi;


    // This effect will run each time `user_id` or `socket.current` changes.
    useEffect(() => {
        // Check if the socket is set
        if (socket.current) {
            socket.current.on('measurementStarted', (data) => {
                // Update local state to match received state
                setIsMeasurementStarted(data.message);
                
            });
            
            socket.current.on('powerCheck', (data) => {  
                setPower(data.message);

                if (data.message) {
                    // If the user ID sent by the server matches our ID, send the start command
                    if (data.userId === user_id && !startCommandSent.current) {
                        Command('',  scriptCommand);
                        startCommandSent.current = true; // Set this to true after sending the start command
                    }
                } else {
                    // Always send the stop command when power is off, regardless of who turned off the power
                    socket.current.emit('driveCommand', { command: '\x03' });
                    socket.current.emit('closeStream');
                    setIsMeasurementStarted(false);
                    startCommandSent.current = false; // Reset this to false when power turns off
                }
            });
        
            // return a cleanup function
            return () => {
                socket.current.off('powerCheck');
                socket.current.off('driveCommand');
                socket.current.off('measurementStarted');
            };
        }
        else {
            console.log('socket is null')
        }
    }, [user_id, socket.current, scriptCommand, startCommandSent.current, isConnected, isConnectedViaSSH, isMeasurementStarted]);

    function CreateSocketConnection() {
        console.log('creating socket connection')
    
        // Before establishing a new connection, ensure any previous connection is properly cleaned
        if (socket.current) {
            socket.current.removeAllListeners();
            socket.current.disconnect();
            socket.current = null; // set to null so a new socket can be created
        }
    
        try {
            console.log('creating socket connection 2')
            socket.current = io(SOCKET_SERVER_URL); //here connection is automatically established to the backend
            
            socket.current.on('connectionStatus', (data) => {
                console.log('received connection status', data.connected)
                if (data && data.connected){
                    setIsConnected(true);
                    sshToRemoteDevice()
                    console.log('Socket connection created to remote device');
                }
                else {
                    setIsConnected(false)
                    setIsConnectedViaSSH(false)
                    console.log('failed to create socket connection')
                }
            })
            
            // Connection lost
            socket.current.on('disconnect', (data) => {
                if (!data.connected) {
                    console.log('Disconnected');
                    DisconnectClientSide();
                }
            });
    
            // Reconnection attempt
            socket.current.on('reconnecting', (attemptNumber) => {
                console.log('trying to reconnect')
            });
    
            socket.current.on('reconnect_failed', () => {
                console.log('Failed to reconnect');
            });
    
        } 
        catch (error) {
            console.error('Failed to create socket connection:', error);
        }
    }

    function sshToRemoteDevice(Connected) {
        console.log('check ssh connection')
        let retryIntervalId;
        const config = {
          host: ipAddressRaspberryPi,
          port: 22,
          username: "ubuntu",
          password: "password",
        }
      
        try {
            socket.current.emit('connectToRemoteDevice',  config );
            socket.current.on('sshConnectionStatus', (data) => {
                setIsConnectedViaSSH(data.connected);
                if (data && data.connected) {
                    clearInterval(retryIntervalId);  // Stop the retry interval
                    retryCount = 0;  // Reset retry count
                }
                else {
                    if (retryIntervalId === null) {  // Start the retry interval only if it's not already running
                        retryIntervalId = setInterval(() => {
                            socket.current.emit('retrySSHConnection');
                            retryCount++;
                        }, 2000);
                    }
                    else {
                        console.error('Failed to reconnect after maximum retries');
                        clearInterval(retryIntervalId);  // Stop the retry interval
                        retryIntervalId = null;
                    }
                    setPower(false);
                }
            });
        }
        catch(error) {
          console.log('FAILED TO CONNECT SSH', error);
          setIsConnectedViaSSH(false);
        }
    }

    function DisconnectClientSide() {
            try{
                console.log('Disconnecting Client from ssh socket');
                socket.current.disconnect(); //disconnects socket from client side
                setIsConnected(false);
                setIsConnectedViaSSH(false)
            }
            catch(error) {
                console.log(error);
                output.current = 'Failed to disconnect'
            }
    }


    function Command(inputType, command) {
        try {
            console.log('Connected: ' + isConnected);
            console.log('isConnectedViaSSH: ' + isConnectedViaSSH);
            console.log('command: ' + command);
            socket.current.emit('command', {command: command}); //TODOProblem
            // listenForTerminalOutput();  // Listen for terminal output when the script starts
        } 
        catch (err) {
            console.log(`Failed to send command: ${err}`);
            responseOutput('Error: ' + err.message);
            socket.current(null); // Reset socket to trigger reconnection
            setIsConnected(false);
            setIsConnectedViaSSH(false)
            showAlert('Geen connectie met de robot!');
            setPower(false);
        }
    }

    function listenForTerminalOutput() {
        if (socket.current) {    
            // Add a new listener
            socket.current.on('output', (data) => {
                if (data && data.data) {
                    // Print terminal output raspi
                    console.log(data.data)
                    responseOutput(data.data);
                } 
                else {
                    showAlert('Niet gelukt om commando te sturen naar de robot!');
                    socket.current.off('output');
                    return null;
                }
            });
        }
    }

    function responseOutput(response){
        output.current = response;
    }

    function responseDir(dir){
        dir.current = dir;
    }

    function OS(os) {
        setOs(os)
    }

    function Loading(loading) {
        setIsLoading(loading)
    }


    function showAlert(message) {
        if (!isAlertShown) {
          setIsAlertShown(true);
          Alert.alert(
            "Alert",
            message,
            [
              {
                text: "OK",
                onPress: () => setIsAlertShown(false)
              }
            ]
          );
        }
      }


    
    console.log(`check rerender`)

    const value = {
        socket: socket,
        output: output,
        dir: dir, 
        isConnected: isConnected,
        isConnectedViaSSH: isConnectedViaSSH,
        os: os,
        isLoading: isLoading,
        power,
        isMeasurementStarted,
        scriptCommand,
        setScriptCommand,
        CreateSocketConnection: CreateSocketConnection,
        DisconnectClientSide: DisconnectClientSide,
        Command: Command,
        responseOutput: responseOutput,
        responseDir: responseDir,
        OS: OS,
        Loading: Loading,
        setPower,
        setIsMeasurementStarted,
        sshToRemoteDevice
    } 

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export default SocketContextProvider