import React, { useEffect, useContext, useState
 } from 'react'
import {Alert} from 'react-native'
import DriveLayout from '../../../components/robot/driving_on_command/DriveLayout';
import { AssignmentContext } from '../../../store/assignment-context';
import { CarContext } from '../../../store/car-context';
import { SocketContext } from '../../../store/socket-context';
import { UserProfileContext } from '../../../store/userProfile-context';

function Controller({navigation, route}) {
    const socketCtx = useContext(SocketContext);
    const carCtx = useContext(CarContext);
    const [keyStroke, setKeyStroke] = useState('')
    const [alertShown, setAlertShown] = useState(false);
    const userprofileCtx = useContext(UserProfileContext);
    const assignmentCtx = useContext(AssignmentContext);
    const [moveXReceived, setMoveXReceived] = useState(0);
    const [moveYReceived, setMoveYReceived] = useState(0);
    const {displayNumber} = route.params; // 1: windmill outline, 2: ..., 3: Car outline

    function powerHandler() {
        socketCtx.setPower(!socketCtx.power);
        if (!socketCtx.power) {        
            switch (displayNumber) {
                case 1:
                    //TODO change to script 1
                    socketCtx.Command('', `cd Documents/lebot_robot_code/catkin_work && roslaunch driver_bot_cpp encoder_movement.launch vel_max:=${carCtx.carProperties.speed} vel_ramp:=${carCtx.carProperties.acceleration} user_id:=${userprofileCtx.userprofile.id} assignment_number:=${assignmentCtx.assignmentImage.assignment_number} assignment_title:=${assignmentCtx.assignmentImage.title}`); 
                    return;
                case 2:
                    //TODO change to script 2
                    socketCtx.Command('', `cd Documents/lebot_robot_code/catkin_work && roslaunch driver_bot_cpp encoder_movement.launch vel_max:=${carCtx.carProperties.speed} vel_ramp:=${carCtx.carProperties.acceleration} user_id:=${userprofileCtx.userprofile.id} assignment_number:=${assignmentCtx.assignmentImage.assignment_number} assignment_title:=${assignmentCtx.assignmentImage.title}`); 
                    return;
                case 3:
                    socketCtx.Command('', `cd Documents/lebot_robot_code/catkin_work && roslaunch driver_bot_cpp encoder_movement.launch vel_max:=${carCtx.carProperties.speed} vel_ramp:=${carCtx.carProperties.acceleration} user_id:=${userprofileCtx.userprofile.id} assignment_number:=${assignmentCtx.assignmentImage.assignment_number} assignment_title:=${assignmentCtx.assignmentImage.title}`); 
                    return;
            }
            
        }
        socketCtx.socket.emit('driveCommand', {command: "\x03"});
    }

    function moveHandler(moveX, moveY) {
        setMoveXReceived(moveX);
        setMoveYReceived(moveY);
        
        if (socketCtx.power) {
            if (-1 <= moveX && moveX <= 1 && -1 < moveY && moveY <= -0.1){
                setKeyStroke(Math.abs(moveY.toFixed(2)) + " w");
            }
            else if (moveX === 1 && -1 <= moveY && moveY <= 1){
                setKeyStroke(Math.abs(moveX.toFixed(2)) + " d");
            }
            else if (moveX === -1 && -1 <= moveY && moveY <= 1){
                setKeyStroke(Math.abs(moveX.toFixed(2)) + " a");
            }
            else if (-1 <= moveX && moveX <= 1 && 0.1 < moveY && moveY <= 1){
                setKeyStroke(Math.abs(moveY.toFixed(2)) + " s");
            }
            else if (moveX === 0 && moveY === 0){
                setKeyStroke(Math.abs(moveY.toFixed(2)) + " x");
            }
        }
        else {
            console.log(alertShown)
            if (!alertShown) {
                Alert.alert(
                    "Power off",
                    "You must turn on the power first!",
                    [
                    {
                        text: "OK",
                        onPress: () => {
                        setAlertShown(false);
                        },
                    },
                    ],
                    { onDismiss: () => setAlertShown(false) }
                );
                setAlertShown(true);
            }
        }
    }


    useEffect(() => {
        socketCtx.socket.emit('driveCommand', {command: keyStroke})
    }, [keyStroke, moveXReceived, moveYReceived])

    function disconnectHandle() {
        console.log('disconnected');
        socketCtx.Disconnect()
        navigation.replace('RobotCommands')
    }

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
