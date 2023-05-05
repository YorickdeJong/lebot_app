import CodeEditor, { CodeEditorSyntaxStyles } from '@rivascva/react-native-code-editor';
import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ColorsBlue } from '../../../constants/palet';
import { SocketContext } from '../../../store/socket-context';
import ChartToggle from '../../robot/driving_on_command/chartToggle';
import { ipAddressRaspberryPi } from '../../../data/ipaddresses.data';

function CodeEditorScreen({close}){
    const socketCtx = useContext(SocketContext);
    const [toggle, setToggle] = useState();
    const [isOn, setIsOn] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [code, setCode] = useState(`if (toggle == rechts){
  motor1Aan()
//voeg hieronder jouw code toe
}
else{
  motor1Uit()
//voeg hieronder jouw code toe
}`
);
    console.log(`Check CodeEditorScREEN`)

    const toggleHandler = () => {
        setIsOn(!isOn);
        
        Animated.timing(animatedValue, {
            toValue: isOn ? 0 : 1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
    };

    function checkIncludeCodeIf(code){
        const motorOne = code[0].includes("motor1Aan()") && code[1].includes("motor1Uit()");
        const motorTwo = code[0].includes("motor2Aan()") && code[1].includes("motor2Uit()") ;
        const motorThree = code[0].includes("motor3Aan()") && code[1].includes("motor3Uit()");
        const motorFour = code[0].includes("motor4Aan()") && code[1].includes("motor4Uit()");
        
        return {
            motorOne,
            motorTwo,
            motorThree,
            motorFour
        }
    }

    function sshConnection(motorOne, motorTwo, motorThree, motorFour) {
        const config = { //TODO make these values statewide
                host: ipAddressRaspberryPi,
                port: 22,
                username: "ubuntu",
                password: "password",
        }
        socketCtx.Connect(config); //set assignment number and title
        setTimeout(() => {
            socketCtx.Command('', `cd Documents/lebot_robot_code/catkin_work && ./devel/lib/driver_bot_cpp/controll_motor ${motorOne ? 1 : 0} ${motorTwo ? 1 : 0} ${motorThree ? 1 : 0} ${motorFour ? 1 : 0}`); 
        }, 1000);
    }



    const checkCode = () => {
        console.log('Code:', code);
        setToggle(!toggle);
        
        if (toggle){
            console.log(`turn script off`)
            socketCtx.socket.current.emit('driveCommand', {command: "\x03"});
            socketCtx.socket.current.emit('disconnectSocket');
            return;
        }
        
        // check validity of code
        const splitCode = code.split(/\belse\b/);
        const {motorOne, motorTwo, motorThree, motorFour} = checkIncludeCodeIf(splitCode)
        
        let motors = ["je mist de actie voor motor 1", "je mist de actie voor motor 2", "je mist de actie voor motor 3", "je mist de actie voor motor 4"]
        if (motorOne){
            motors[0] = "motor 1 is correct"
        }

        if (motorTwo){
            motors[1] = "motor 2 is correct"
        }

        if (motorThree){
            motors[2] = "motor 3 is correct"
        }

        if (motorFour){
            motors[3] = "motor 4 is correct"
        }

        const scriptMessage = `Het script wordt gestart met de volgende waarden: ${motorOne ? 'motor 1': null} ${motorTwo ? 'motor 2': ''} ${motorThree ? 'motor 3' : ''} ${motorFour ? 'motor 4' : ''} ` 
        Alert.alert(
            `In jouw code is:\n${motors[0]}\n${motors[1]}\n${motors[2]}\n${motors[3]}\n\n${scriptMessage}`
        )

        // Send the code to the server, as shown in the previous example, and display the result
        sshConnection(motorOne, motorTwo, motorThree, motorFour);
        
    };


    return (
        <>
            <View style={[styles.outerContainer, {height: close? "100%" : 250}]}>
                <CodeEditor
                    style={styles.codeEditor}
                    language="javascript"
                    syntaxStyle={CodeEditorSyntaxStyles.atomOneDark}
                    showLineNumbers
                    initialValue={code}
                    onChange={setCode}
                    
                />
                <View style = {[styles.buttonContainer, {height: close? "100%" : 250 }]}>
                    <ChartToggle
                    toggleChart = {toggle}
                    toggleChartSettings = {checkCode}
                    
                    /> 
                </View>
            </View>
        </>
    )
}

export default React.memo(CodeEditorScreen);

const styles  = StyleSheet.create({
    border: {
        shadowColor: `rgba(33, 33, 33`,
        shadowOffset: {height: 1, width: 0},
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 1,
    },
    outerContainer: {
        flexDirection: 'row',
        paddingVertical: 3,
        backgroundColor: ColorsBlue.blue1300,
    },
    text: {
        fontSize: 18,
        color: ColorsBlue.blue100,
    },
    button: {
        marginBottom: 5,
        backgroundColor: ColorsBlue.blue1000,
        borderColor: ColorsBlue.blue100,
        borderWidth: 0.4,
        borderRadius: 5,
        padding: 2,
        paddingHorizontal: 5
    },
    buttonContainer: {        
        backgroundColor: ColorsBlue.blue1300,
        width: "18%",
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 15
    },
    codeEditor: {
        fontSize: 14,
        inputLineHeight: 23,
        highlighterLineHeight: 23,
        backgroundColor: ColorsBlue.blue1300,
        width: "82%",
    }
})