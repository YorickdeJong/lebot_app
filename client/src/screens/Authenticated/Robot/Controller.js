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

function Controller({ navigation, route }) {
    const socketCtx = useContext(SocketContext);
    const userprofileCtx = useContext(UserProfileContext);
    const assignmentCtx = useContext(AssignmentContext);
    const [alertShown, setAlertShown] = useState(false);
    const moveXReceived = useRef(0);
    const moveYReceived = useRef(0);
    const { displayNumber, startScriptCommand } = route.params;
    const rerenderCount = useRef(0);


    //connect power measurement socket to database if subject is CAR
    const shouldConnectPower = useMemo(() => assignmentCtx.assignmentImage.subject === "CAR", [assignmentCtx.assignmentImage.subject]);
    const socketPower = useSocketPower(shouldConnectPower, userprofileCtx.userprofile.id);

    const shouldConnectMeasurement = useMemo(() => assignmentCtx.assignmentImage.subject === "MOTOR", [assignmentCtx.assignmentImage.subject]);
    const socketMeasurement = useSocketMeasurementResults(shouldConnectMeasurement, userprofileCtx.userprofile.id);

    useEffect(() => {
        rerenderCount.current += 1;
        console.log('Controller rendered', rerenderCount.current);
    }, [socketCtx.socket]);

    const powerHandler = useCallback(() => {
        socketCtx.setPower((prevPower) => !prevPower);
        if (!socketCtx.power) {
            if (startScriptCommand) {
                socketCtx.Command('',  startScriptCommand);
            }
            else{
                console.log('ERROR: subject is not defined')
            }
        } 
        else {
            socketCtx.socket.current.emit('driveCommand', { command: '\x03' });
        }
    }, [socketCtx.power]);

    const throttledEmitDriveCommand = useCallback(
        throttle((command) => {
            socketCtx.socket.current.emit('driveCommand', { command });
        }, 50), // Adjust the delay (in ms) according to your requirements
    [socketCtx.socket]);

    const moveHandler = useCallback((moveX, moveY) => {
        moveXReceived.current = moveX;
        moveYReceived.current = moveY;

        if (socketCtx.power) {
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
        } 
        
        else if (!alertShown) {
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
