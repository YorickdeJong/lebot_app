import React, { useEffect, useRef, useContext, useState, useCallback, useMemo
 } from 'react'
import {Alert} from 'react-native'
import DriveLayout from '../../../components/robot/driving_on_command/DriveLayout';
import { AssignmentContext } from '../../../store/assignment-context';
import { CarContext } from '../../../store/car-context';
import { SocketContext } from '../../../store/socket-context';
import { UserProfileContext } from '../../../store/userProfile-context';
import { throttle } from 'lodash';
import { useSocketPower } from '../../../hooks/power_measurement.hooks';
import { useSocketMeasurementResults } from '../../../hooks/measurement_results';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

function Controller({ navigation, route }) {
    const socketCtx = useContext(SocketContext);
    const userprofileCtx = useContext(UserProfileContext);
    const assignmentCtx = useContext(AssignmentContext);
    const [alertShown, setAlertShown] = useState(false);
    const moveXReceived = useRef(0);
    const moveYReceived = useRef(0);
    const { displayNumber, startScriptCommand, measurementType } = route.params;
    const subject = assignmentCtx.assignmentImage.subject;

    //connect power measurement socket to database if subject is CAR
    const shouldConnectPower = useMemo(() => subject === "CAR", [assignmentCtx.assignmentImage.subject]);
    if (subject === "CAR") {
        const socketPower = useSocketPower(shouldConnectPower, userprofileCtx.userprofile.group_id);
    }

    const shouldConnectMeasurement = useMemo(() => subject === "MOTOR", [assignmentCtx.assignmentImage.subject]);
    if (subject === "MOTOR") {
        const socketMeasurement = useSocketMeasurementResults(shouldConnectMeasurement, userprofileCtx.userprofile.group_id);
    }
    
    useFocusEffect(
        useCallback(() => {
            return () => {
                console.log('exit controller')
                for (let i = 0; i < 5; i++) {
                    socketCtx.socket.current.emit('driveCommand', { command: '\x03' });
                }
                // socketCtx.setPower(false);
                socketCtx.socket.current.emit('power', { message: false });
            };
        }, [])
    );

    useEffect(() => {
        // Here, we're saying "when a powerCheck event is received, run this callback function"
        socketCtx.socket.current.on('powerCheck', (data) => {
            // This is where you're handling the received data.
            console.log('Received powerCheck: ', data.message);
    
            // Here, we're updating our local state to match the state we just received from the server.
            // We're assuming that data.message is a boolean that represents the current power state.
            socketCtx.setPower(data.message);
        });
    
        // In the cleanup function, we're saying "when this component is unmounted, stop listening to powerCheck events"
        return () => {
            socketCtx.socket.current.off('powerCheck');
        };
    }, []);  


    useEffect(() => {   
        if (socketCtx.power) {
            socketCtx.Command('',  startScriptCommand);
        }
        else {
            socketCtx.socket.current.emit('driveCommand', { command: '\x03' });
        }

    }, [socketCtx.power]);
    // const powerHandler = useCallback(() => {
    //     if (!socketCtx.isConnected && !socketCtx.isConnectedViaSSH) {
    //         Alert.alert('Niet verbonden met de robot', 'Check of de robot aanstaat en dat je verbonden bent met het netwerk, ik probeer je opnieuw te verbinden')
    //         return 
    //     }
    //     socketCtx.setPower((prevPower) => !prevPower);
    //     if (!socketCtx.power) {
    //         if (startScriptCommand) {
                // socketCtx.Command('',  startScriptCommand);
                // socketCtx.socket.current.emit('power', { message: true });
    //         }
    //         else{
    //             console.log('ERROR: subject is not defined')
    //         }
    //     } 
    //     else {
    //         console.log('sent stop command')
    //         socketCtx.socket.current.emit('driveCommand', { command: '\x03' });
    //         socketCtx.socket.current.emit('power', { message: false });
    //     }
    // }, [socketCtx.power, socketCtx.isConnected, socketCtx.isConnectedViaSSH, startScriptCommand]);

    const powerHandler = useCallback(() => {
        if (!socketCtx.isConnected && !socketCtx.isConnectedViaSSH) {
            Alert.alert('Niet verbonden met de robot', 'Check of de robot aanstaat en dat je verbonden bent met het netwerk, ik probeer je opnieuw te verbinden')
            return 
        }
    
        // We only emit 'power' events here, not setting state.
        if (!socketCtx.power) {
            if (startScriptCommand) {
                // socketCtx.Command('',  startScriptCommand);
                socketCtx.socket.current.emit('power', { message: true });
            } else{
                console.log('ERROR: subject is not defined')
            }
        } else {
            console.log('sent stop command')
            // socketCtx.socket.current.emit('driveCommand', { command: '\x03' });
            socketCtx.socket.current.emit('power', { message: false });
        }
    }, [socketCtx.power, socketCtx.isConnected, socketCtx.isConnectedViaSSH, startScriptCommand]);

    
    useEffect(() => {
        const interval = setInterval(() => {
            if (socketCtx.power && measurementType === 'free_driving') {
                let newKeyStroke = '';
    
                let moveX = moveXReceived.current;
                let moveY = moveYReceived.current;

                if (-1 <= moveX && moveX <= 1 && -1 < moveY && moveY <= -0.1) {
                    newKeyStroke = Math.abs(moveY.toFixed(2)) + ' w';
                } 
                else if (moveX === 1 && -1 <= moveY && moveY <= 1) {
                    newKeyStroke = Math.abs(moveX.toFixed(2)) + ' d';
                } 
                else if (moveX === -1 && -1 <= moveY && moveY <= 1) {
                    newKeyStroke = Math.abs(moveX.toFixed(2)) + ' a';
                } 
                else if (-1 <= moveX && moveX <= 1 && 0.1 < moveY && moveY <= 1) {
                    newKeyStroke = Math.abs(moveY.toFixed(2)) + ' s';
                } 
                else if (moveX === 0 && moveY === 0) {
                    newKeyStroke = Math.abs(moveY.toFixed(2)) + ' x';
                }
    
                if (newKeyStroke) {
                    throttledEmitDriveCommand(newKeyStroke);
                }
            }
        }, 100);
    
        return () => clearInterval(interval);
    }, [socketCtx.power, throttledEmitDriveCommand]);

    const throttledEmitDriveCommand = useCallback(
        throttle((command) => {
            socketCtx.socket.current.emit('driveCommand', { command });
        }, 50), // Adjust the delay (in ms) according to your requirements
    [socketCtx.socket]);

    const moveHandler = useCallback((moveX, moveY) => {
        moveXReceived.current = moveX;
        moveYReceived.current = moveY;

        if (socketCtx.power && measurementType === 'free_driving') {
            let newKeyStroke = '';

            if (-1 <= moveX && moveX <= 1 && -1 < moveY && moveY <= -0.1) {
                newKeyStroke = Math.abs(moveY.toFixed(2)) + ' w';
            } 
            else if (moveX === 1 && -1 <= moveY && moveY <= 1) {
                newKeyStroke = Math.abs(moveX.toFixed(2)) + ' d';
            } 
            else if (moveX === -1 && -1 <= moveY && moveY <= 1) {
                newKeyStroke = Math.abs(moveX.toFixed(2)) + ' a';
            } 
            else if (-1 <= moveX && moveX <= 1 && 0.1 < moveY && moveY <= 1) {
                newKeyStroke = Math.abs(moveY.toFixed(2)) + ' s';
            } 
            else if (moveX === 0 && moveY === 0) {
                newKeyStroke = Math.abs(moveY.toFixed(2)) + ' x';
            }

            if (newKeyStroke) {
                throttledEmitDriveCommand(newKeyStroke);
            }

            console.log('key throttle self', newKeyStroke)
        } 
        
        else if (!alertShown && measurementType === 'free_driving') {
            Alert.alert(
                'Rover staat uit',
                'Druk eerst op de aanknop!',
                [
                {
                    text: 'OK',
                    onPress: () => {
                        setAlertShown(false);
                    },
                },
                ],
                { onDismiss: () => setAlertShown(false) }
            );
            setAlertShown(true);
            }
        else {
            Alert.alert('Verkeerde Meting', "Met de meting kan je de rover niet besturen, kies 'zelf besturen'")        
        }
    }, [socketCtx.power, alertShown, throttledEmitDriveCommand]);


    return (
        <DriveLayout 
        moveHandler={moveHandler}
        midIconHandler={powerHandler}
        displayNumber={displayNumber}
        subject={assignmentCtx.assignmentImage.subject}
        assignmentNumber={assignmentCtx.assignmentImage.assignment_number}
        />
        )
}

export default React.memo(Controller)
