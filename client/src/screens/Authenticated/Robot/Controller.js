import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useContext, useState
 } from 'react'
import {View, Text, StyleSheet, Alert} from 'react-native'
import Icon from '../../../components/Icon'
import DriveLayout from '../../../components/robot/driving_on_command/DriveLayout';
import { ColorsBlue } from '../../../constants/palet'
import { CarContext } from '../../../store/car-context';

import { SocketContext } from '../../../store/socket-context';
function Controller({navigation}) {
    const socketCtx = useContext(SocketContext);
    const carCtx = useContext(CarContext);
    const [keyStroke, setKeyStroke] = useState('')
    const [power, setPower] = useState(false);
    const [alertShown, setAlertShown] = useState(false);
    
    const velMax = 50.2;
    const velRamp = 10.2;
    function powerHandler() {
        setPower(!power);
        if (!power) {            
            socketCtx.Command('', `cd Documents/LeBot/catkin_work && roslaunch driver_bot_cpp move_on_command.launch vel_max:=${carCtx.carProperties.speed} vel_ramp:=${carCtx.carProperties.acceleration}`); //cd $(dirname $(find / -name catkin_work 2>/dev/null)) && roslaunch driver_bot_cpp driving_on_command.launch 
            return;
        }
        socketCtx.socket.emit('driveCommand', {command: "\x03"});
    }

    function moveHandler(inputType, isDown) {
        if (power) {
            switch (inputType){
                case 'up':
                   if (isDown) {
                        console.log("moving forward");
                        setKeyStroke("w");
                    } 
                    else {
                        console.log("stop moving forward");
                        setKeyStroke("x");
                    }
                    break;

                case "right":
                    if (isDown) {
                        console.log("moving right");
                        setKeyStroke("d");
                    } 
                    else {
                        console.log("stop moving right");
                        setKeyStroke("x");
                    }
                    break;

                case "left":
                    if (isDown) {
                        console.log("moving left");
                        setKeyStroke("a");
                    } 
                    else {
                        console.log("stop moving left");
                        setKeyStroke("x");
                    }
                    break;

                case "down":
                    if (isDown) {
                        console.log("moving backwards");
                        setKeyStroke("s");
                    } 
                    else {
                        console.log("stop moving backwards");
                        setKeyStroke("x");
                    }
                    break;
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
    }, [keyStroke])

    function disconnectHandle() {
        console.log('disconnected');
        socketCtx.Disconnect()
        navigation.replace('RobotCommands')
    }

    return (
        <DriveLayout 
        moveHandler={moveHandler}
        powerHandler={powerHandler}
        disconnectHandle={disconnectHandle}
        power = {power}/>
        )
}

export default Controller
