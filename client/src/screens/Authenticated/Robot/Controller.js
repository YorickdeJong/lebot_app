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
    const carCtx = useContext(CarContext);
    const userprofileCtx = useContext(UserProfileContext);
    const assignmentCtx = useContext(AssignmentContext);
    const [alertShown, setAlertShown] = useState(false);
    const moveXReceived = useRef(0);
    const moveYReceived = useRef(0);
    const { displayNumber, motorStand, command } = route.params;
    
    //connect power measurement socket to database if subject is CAR
    const shouldConnectPower = useMemo(() => assignmentCtx.assignmentImage.subject === "CAR", [assignmentCtx.assignmentImage.subject]);
    const socketPower = useSocketPower(shouldConnectPower, userprofileCtx.userprofile.id);

    const shouldConnectMeasurement = useMemo(() => assignmentCtx.assignmentImage.subject === "MOTOR", [assignmentCtx.assignmentImage.subject]);
    const socketMeasurement = useSocketMeasurementResults(shouldConnectMeasurement, userprofileCtx.userprofile.id);

    const powerHandler = useCallback(() => {
        socketCtx.setPower((prevPower) => !prevPower);
        if (!socketCtx.power) {
            const { subject } = assignmentCtx.assignmentImage;
            let command;

            //start up specific script on the robot, using the sshSocket
            if (subject === "MOTOR" && !motorStand){
                command = `cd Documents/lebot_robot_code/catkin_work && roslaunch driver_bot_cpp encoder_movement.launch vel_max:=${carCtx.carProperties.speed} vel_ramp:=${carCtx.carProperties.acceleration} user_id:=${userprofileCtx.userprofile.id} assignment_number:=${assignmentCtx.assignmentImage.assignment_number} assignment_title:="${assignmentCtx.assignmentImage.title}" subject_title:=${assignmentCtx.assignmentImage.subject}`;
            }
            else if (subject === "CAR" && !motorStand){
                command = `cd Documents/lebot_robot_code/catkin_work && roslaunch driver_bot_cpp power_movement.launch vel_max:=${carCtx.carProperties.speed} vel_ramp:=${carCtx.carProperties.acceleration} user_id:=${userprofileCtx.userprofile.id} assignment_number:=${assignmentCtx.assignmentImage.assignment_number} assignment_title:="${assignmentCtx.assignmentImage.title}" subject_title:=${assignmentCtx.assignmentImage.subject}`;
            }
            else if (subject === "CAR" && motorStand){
                command = `cd Documents/lebot_robot_code/catkin_work && roslaunch driver_bot_cpp power_movement.launch vel_max:=${motorStand} vel_ramp:=${carCtx.carProperties.acceleration} user_id:=${userprofileCtx.userprofile.id} assignment_number:=${assignmentCtx.assignmentImage.assignment_number} assignment_title:="${assignmentCtx.assignmentImage.title}" subject_title:=${assignmentCtx.assignmentImage.subject}`;
            }
            else{
                console.log('ERROR: subject is not defined')
            }
            socketCtx.Command('', command);

        } else {
            socketCtx.socket.current.emit('driveCommand', { command: '\x03' });
        }
    }, [socketCtx, carCtx, userprofileCtx, assignmentCtx, displayNumber, socketPower, socketMeasurement]);

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
                'Power off',
                'You must turn on the power first!',
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
        />
        )
}

export default React.memo(Controller)
