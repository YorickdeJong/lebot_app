import { useEffect, useContext, useState
 } from 'react'
import {Alert} from 'react-native'
import DriveLayout from '../../../components/robot/driving_on_command/DriveLayout';
import { CarContext } from '../../../store/car-context';
import { ChartContext } from '../../../store/chart-context';

import { SocketContext } from '../../../store/socket-context';

function Controller({navigation}) {
    const socketCtx = useContext(SocketContext);
    const carCtx = useContext(CarContext);
    const chartCtx = useContext(ChartContext);
    const [keyStroke, setKeyStroke] = useState('')
    const [alertShown, setAlertShown] = useState(false);
    
    const velMax = 50.2;
    const velRamp = 10.2;
    function powerHandler() {
        socketCtx.setPower(!socketCtx.power);
        if (!socketCtx.power) {            
            socketCtx.Command('', `cd Documents/lebot_robot_code/catkin_work && roslaunch driver_bot_cpp move_on_command.launch vel_max:=${velMax} vel_ramp:=${velRamp}`); // ${carCtx.carProperties.speed} cd $(dirname $(find / -name catkin_work 2>/dev/null)) && roslaunch driver_bot_cpp driving_on_command.launch 
            return;
        }
        socketCtx.socket.emit('driveCommand', {command: "\x03"});
    }

    function moveHandler(moveX, moveY) {
        console.log(`received moveX: ${moveX} and moveY: ${moveY}`) //TODO: check logic here
        if (socketCtx.power) {
            if (-1 <= moveX && moveX <= 1 && moveY === -1){
                console.log("moving forward");
                setKeyStroke("w");
            }
            else if (moveX === 1 && -1 <= moveY && moveY <= 1){
                console.log("moving right");
                setKeyStroke("d");
            }
            else if (moveX === -1 && -1 <= moveY && moveY <= 1){
                console.log("moving left");
                setKeyStroke("a");
            }
            else if (-1 <= moveX && moveX <= 1 && moveY === 1){
                console.log("moving backwards");
                setKeyStroke("s");
            }
            else if (moveX === 0 && moveY === 0){
                console.log("stop moving");
                setKeyStroke("x");
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
        />
        )
}

export default Controller
