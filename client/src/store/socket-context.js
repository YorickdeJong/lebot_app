import { createContext, useState, useEffect, useRef } from "react";
import {AppState, Alert} from 'react-native'

import io from 'socket.io-client';
import { ipAddressComputer, ipAddressRaspberryPi } from "../data/ipaddresses.data";
import { set } from "react-native-reanimated";
export const SocketContext = createContext({
    socket: null,
    output: '',
    dir: '',
    isConnected: false,
    os: '',
    isLoading: false, 
    power: false,
    isMeasurementStarted: false,
    robotConnectedToWifi: false,
    CreateSocketConnection: (socket) => {},
    Connect: () => {},
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
    const output = useRef('');
    const dir = useRef('');
    const [os, setOs] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [power, setPower] = useState(false); 
    const [isMeasurementStarted, setIsMeasurementStarted] = useState(false);
    const [isAlertShown, setIsAlertShown] = useState(false);


    const SOCKET_SERVER_URL = ipAddressComputer;
    
    // This effect sets up event listeners when socket.current changes.
    // It also cleans up these listeners when socket.current changes.
    useEffect(() => {
        if (socket.current) {
            socket.current.on('connection', () => {
                console.log('Connected to server');
            });

            socket.current.on('sshConnectionStatus', (data) => {
                console.log('SSH Connection Status: ' + data.connected);
                setIsConnected(data.connected);
                if (data && !data.connected) {
                    setPower(false);
                    Disconnect();
                    console.log('Connection message: ' + data.message);
                } 
            });

            if (!isMeasurementStarted) {
                socket.current.on('measurementStarted', (data) => {
                    console.log(`DATA MESSAGE: ${data.message}`)
                    if(data.message === 'Measurement started') {
                        console.log('Measurement Started, DATA RECEIVED')
                        setIsMeasurementStarted(true)
                    }
                });
            }

            // Return a cleanup function to remove listeners when socket.current changes or the component unmounts.
            return () => {
                socket.current.off('connection');
                socket.current.off('sshConnectionStatus');
                if (!isMeasurementStarted) {
                    socket.current.off('measurementStarted');
                }
                socket.current.off('terminalOutput');  // Remove the 'terminalOutput' listener
            };
        }
    }, [socket.current, isMeasurementStarted, Disconnect]);

    function CreateSocketConnection() {
        try {
            if (!socket.current) {
                socket.current = io(SOCKET_SERVER_URL);
                console.log('Socket created');
    
                // Connection successful
                socket.current.once('connect', () => {
                    console.log('Connected to server');
                    setIsConnected(true);
                    // Automatically attempt to reconnect
                    EstablishSocketConnection();
                });
    
                // Connection lost
                socket.current.on('disconnect', () => {
                    console.log('Disconnected');
                    setIsConnected(false);
                    Disconnect();
                });
    
                // Reconnection attempt
                socket.current.on('reconnecting', (attemptNumber) => {
                    console.log(`Reconnecting attempt ${attemptNumber}`);
                });
    
                // Inside your CreateSocketConnection function
                socket.current.on('reconnect_failed', () => {
                    console.log('Failed to reconnect');
                    setIsConnected(false);

                    // Implement a backoff algorithm for reconnection
                    let attemptInterval = 1000; // Start with a 1 second interval
                    const maxInterval = 60 * 1000; // Max interval is 1 minute

                    const reconnectionAttempt = setInterval(() => {
                        if (attemptInterval < maxInterval) {
                            attemptInterval *= 2; // Double the interval each time
                        }
                        // Try to reconnect
                        socket.current.connect();

                    }, attemptInterval);
                });
            }
        } 
        catch (error) {
            console.error('Failed to create socket connection:', error);
        }
    }

    function Connect(config, callback) {
        try{
            socket.current.emit('connectToRemoteDevice',  config );
            setIsConnected(true);
        }
        catch(error) {
            console.log(error);
            output.current = 'Connection Failed'
            setIsConnected(false);
        }

    }
    
    function Disconnect() {
        if (isConnected) {
            try{
                console.log('Disconnecting Client from ssh socket');
                socket.current.disconnect();
                setIsConnected(false);
            }
            catch(error) {
                console.log(error);
                output.current = 'Failed to disconnect'
            }
        }
    }

    function EstablishSocketConnection() {
        const config = { //TODO make these values statewide
            host: ipAddressRaspberryPi,     
            port: 22,
            username: "ubuntu",
            password: "password",
        }
        try {
            Connect(config); //set assignment number and title
            setIsConnected(true);
        }
        catch (error){
            setPower(false);
        }
    }


    function Command(inputType, command) {
        try {
            console.log('command: ' + command);
            socket.current.emit('command', {command: command}); //TODOProblem
            listenForTerminalOutput();  // Listen for terminal output when the script starts
        } 
        catch (err) {
            console.log(`Failed to send command: ${err}`);
            responseOutput('Error: ' + err.message);
            socket.current(null); // Reset socket to trigger reconnection
            setIsConnected(false);
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
        EstablishSocketConnection
    } 

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export default SocketContextProvider