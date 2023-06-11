import CodeEditor, { CodeEditorSyntaxStyles } from '@rivascva/react-native-code-editor';
import React, { useContext, useState } from 'react';
import { Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ColorsBlue, ColorsGreen, ColorsRed } from '../../../constants/palet';
import { SocketContext } from '../../../store/socket-context';
import ChartToggle from '../../robot/driving_on_command/chartToggle';
import { ipAddressRaspberryPi } from '../../../data/ipaddresses.data';
import Icon from '../../Icon';

function CodeEditorScreen({close, code, setCode, onPressHandler, condition, section, backgroundColor, containerBackgroundColor, shadowOpacity}){
    const socketCtx = useContext(SocketContext);
    const [toggle, setToggle] = useState();

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
        socketCtx.Command('', `cd Documents/lebot_robot_code/catkin_work && ./devel/lib/driver_bot_cpp/controll_motor ${motorOne ? 1 : 0} ${motorTwo ? 1 : 0} ${motorThree ? 1 : 0} ${motorFour ? 1 : 0}`); 
    }

    const checkCode = () => {
        if (!socketCtx.isConnected || !socketCtx.isConnectedViaSSH) {
            Alert.alert('Niet verbonden met de robot', 'Verbind met het wifi netwerk van de robot en probeer het opnieuw')
            return
        }

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

    function wifiIconHandler() {
        if (socketCtx.isConnectedViaSSH) {
            Alert.alert('Verbonden met de robot')
        } 
        else {
            Alert.alert('Niet verbonden met de robot')
        }
    }

    return (
        <>
            <View style={[styles.outerContainer, {height: close? "100%" : 250}]}>
                <View style = {{overflow: 'hidden', borderRadius: 20, paddingRight: 90}}>
                    <CodeEditor
                        style={styles.codeEditor}
                        language="javascript"
                        syntaxStyle={CodeEditorSyntaxStyles.atomOneDark}
                        showLineNumbers
                        initialValue={code}
                        onChange={setCode}
                        enableEditing={section === 'chartToggle' ? true : false}
                    />
                </View>
                {section === 'chartToggle' &&
                <>
                    <View style = {[styles.buttonContainer]}>
                        <ChartToggle
                            toggleChart = {toggle}
                            toggleChartSettings = {checkCode}
                            notShowBorder={true}
                        />
                    </View>
                    <View style = {{position: 'absolute', right: '6%', top: '5%'}}>
                        <Icon 
                            icon = 'wifi'
                            size = {30}
                            color = {socketCtx.isConnectedViaSSH ? ColorsGreen.green700 : ColorsRed.red700}
                            onPress = {() => wifiIconHandler()}
                        />
                    </View>
                </>
                }

                {section === 'knop' && 
                <>
                    <View style = {styles.onButton}>
                            <TouchableOpacity 
                            onPress = {onPressHandler}
                            style = {{padding: 5, backgroundColor: ColorsBlue.blue1200, borderRadius: 15, width: 70, borderColor: ColorsBlue.blue600, borderWidth: 1}}
                            >
                                <Text style = {[styles.text, {textAlign: 'center'}]}>{condition ? 'Uit' : 'Aan'}</Text>
                            </TouchableOpacity> 
                    </View>
                    <Animated.View style={[styles.container, {backgroundColor: containerBackgroundColor}]}>
                        <Animated.View
                            style={[
                                {
                                    width: 30,
                                    height: 30,
                                    borderRadius: 50,
                                    borderColor: ColorsBlue.blue1400,
                                    borderWidth: 1,
                                    alignSelf: 'center',
                                },
                                { backgroundColor },
                                {
                                    shadowColor: 'rgb(255, 211, 0)',
                                    shadowOffset: { width: 0, height: 0 },
                                    shadowOpacity,
                                    shadowRadius: 30,  
                                }
                            ]}
                        />
                    </Animated.View>
                </>
                }
            </View>
        </>
    )
}

export default React.memo(CodeEditorScreen);

const styles  = StyleSheet.create({
    container: {
        width: 60,
        height: 60,
        borderRadius: 50,
        position: 'absolute',
        right: '7%',
        top: '10%',
        borderWidth: 1,
        justifyContent: 'center',
        zIndex: 1,
    },
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
        backgroundColor: ColorsBlue.blue1390,
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: `rgba(77, 77, 77, 0.2)`,
        borderRadius: 20,
        shadowColor: `rgba(0, 0, 0, 1)`,
        shadowOffset: { height: 3, width: 1 },
        shadowRadius: 3,
        shadowOpacity: 1,
        elevation: 4,   
        marginBottom: 5
    },
    text: {
        fontSize: 18,
        color: ColorsBlue.blue100,
    },
    onButton: {
        position: 'absolute',
        right: '5%',
        bottom: '7%',
        zIndex: 10,
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
        backgroundColor: ColorsBlue.blue1390,
        position: 'absolute',
        right: 0,
        bottom: 0, 
        zIndex: 10,
        overflow: 'hidden',
        borderRadius: 20,
    },
    codeEditor: {
        fontSize: 14,
        inputLineHeight: 23,
        highlighterLineHeight: 23,
        backgroundColor: ColorsBlue.blue1390,
        overflow: 'hidden',
        borderRadius: 20,
    }
})