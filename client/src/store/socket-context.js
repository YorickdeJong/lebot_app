import { createContext, useState, useEffect, useRef } from "react";
import {AppState, Alert} from 'react-native'

import io from 'socket.io-client';
import { fullIpAddressRaspi, ipAddressComputer, ipAddressRaspberryPi } from "../data/ipaddresses.data";
import { set } from "react-native-reanimated";
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
    const [isConnected, setIsConnected] = useState(false);
    const [isConnectedViaSSH, setIsConnectedViaSSH] = useState(false);
    const output = useRef('');
    const dir = useRef('');
    const [os, setOs] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [power, setPower] = useState(false); 
    const [isMeasurementStarted, setIsMeasurementStarted] = useState(false);
    const [isAlertShown, setIsAlertShown] = useState(false);


    const SOCKET_SERVER_URL = fullIpAddressRaspi;
    
    // This effect sets up event listeners when socket.current changes.
    // It also cleans up these listeners when socket.current changes.
    useEffect(() => {
        if (socket.current) {
            if (!isMeasurementStarted) {
                socket.current.on('measurementStarted', (data) => {
                    if(data.message === 'Measurement started') {
                        console.log('Measurement Started, DATA RECEIVED')
                        setIsMeasurementStarted(true)
                    }
                });
            }

            // Return a cleanup function to remove listeners when socket.current changes or the component unmounts.
            return () => {
                socket.current.off('command')
                socket.current.off('terminalOutput');  // Remove the 'terminalOutput' listener

                if (!isMeasurementStarted) {
                    socket.current.off('measurementStarted');
                }
            };
        }
    }, [socket.current, isMeasurementStarted, power]);



    function CreateSocketConnection() {
        console.log('creating socket connection')
    
        if (socket.current) {
            socket.current.disconnect();
            socket.current = null;  // set to null so a new socket can be created
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
                console.log('data', data.connected)
                if (data && data.connected) {
                    setIsConnectedViaSSH(true);
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
                    setIsConnectedViaSSH(false)
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
            listenForTerminalOutput();  // Listen for terminal output when the script starts
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
            // Remove any existing listener before adding a new one
            socket.current.off('terminalOutput');
    
            // Add a new listener
            socket.current.on('terminalOutput', (data) => {
                if (data && data.data) {
                    // Print terminal output raspi
                    console.log(data.data)
                    responseOutput(data.data);
                } 
                else {
                    showAlert('Niet gelukt om commando te sturen naar de robot!');
                    socket.current.off('terminalOutput');
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