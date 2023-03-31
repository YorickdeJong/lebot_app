import React, { useEffect, useContext, useState, useCallback
 } from 'react'
import {Alert} from 'react-native'
import DriveLayout from '../../../components/robot/driving_on_command/DriveLayout';
import { AssignmentContext } from '../../../store/assignment-context';
import { CarContext } from '../../../store/car-context';
import { SocketContext } from '../../../store/socket-context';
import { UserProfileContext } from '../../../store/userProfile-context';

function Controller({ navigation, route }) {
    const socketCtx = useContext(SocketContext);
    const carCtx = useContext(CarContext);
    const userprofileCtx = useContext(UserProfileContext);
    const assignmentCtx = useContext(AssignmentContext);
    const [keyStroke, setKeyStroke] = useState('');
    const [alertShown, setAlertShown] = useState(false);
    const [moveXReceived, setMoveXReceived] = useState(0);
    const [moveYReceived, setMoveYReceived] = useState(0);
    const { displayNumber } = route.params;

    console.log(`Controller`)

    const powerHandler = useCallback(() => {
        socketCtx.setPower((prevPower) => !prevPower);
        if (!socketCtx.power) {
        const command = `cd Documents/lebot_robot_code/catkin_work && roslaunch driver_bot_cpp encoder_movement.launch vel_max:=${carCtx.carProperties.speed} vel_ramp:=${carCtx.carProperties.acceleration} user_id:=${userprofileCtx.userprofile.id} assignment_number:=${assignmentCtx.assignmentImage.assignment_number} assignment_title:=${assignmentCtx.assignmentImage.title}`;
        socketCtx.Command('', command);
        } else {
        socketCtx.socket.current.emit('driveCommand', { command: '\x03' });
        }
    }, [socketCtx, carCtx, userprofileCtx, assignmentCtx, displayNumber]);

    const moveHandler = useCallback((moveX, moveY) => {
        setMoveXReceived(moveX);
        setMoveYReceived(moveY);

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

            // setKeyStroke(newKeyStroke);
            if (newKeyStroke) {
                socketCtx.socket.current.emit('driveCommand', { command: newKeyStroke });
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
    }, [socketCtx.power, alertShown]);

    const disconnectHandle = useCallback(() => {
        console.log('disconnected');
        socketCtx.Disconnect();
        navigation.replace('RobotCommands');
    }, [socketCtx, navigation]);

    return (
        <DriveLayout 
        moveHandler={moveHandler}
        midIconHandler={powerHandler}
        rightIconHandler={disconnectHandle}
        displayNumber={displayNumber}
        />
        )
}

export default React.memo(Controller)
