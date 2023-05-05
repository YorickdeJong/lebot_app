
import {Modal, View, StyleSheet, TextInput, TouchableOpacity, Text, Alert, ActivityIndicator} from 'react-native';
import Icon from "../Icon";
import { ColorsBlue, ColorsGray } from "../../constants/palet";
import { useContext, useState } from "react";
import { SocketContext } from "../../store/socket-context";
import BlurWrapper from "./BlurViewWrapper";
import { ipAddressRaspberryPi } from '../../data/ipaddresses.data';
import { AssignmentContext } from '../../store/assignment-context';
import { useNavigation } from '@react-navigation/native';
import { UserProfileContext } from '../../store/userProfile-context';





function CustomMeasurementModal({showMeasurementModal, setShowMeasurementModal, questionData, subject}) {
    const socketCtx = useContext(SocketContext)
    const assignmentCtx = useContext(AssignmentContext)
    const navigation = useNavigation();

    function closeHandler(){
        setShowMeasurementModal(false)
        socketCtx.Disconnect();
    }

    function redirectToMeasurementHandler(type) {
        
        let command = null
        let motorStand = 0;
        switch (type) {
            case '1':
                command = 'start constante snelheid meting script ' //bedenk of je een predetermined snelheid wilt of van de user zelf -> kunnen ze de motoren al laten werken
                break;
            case '2':
                command = 'start constante versnelling meting script'
                break;
            case '3':
                command = 'Vrij rijden script'
                break;
            case '4':
                motorStand = 40;
                break;
            case '5':
                motorStand = 60;
                break;
            case '6':
                motorStand = 80;
                break;
            case '7':
                motorStand = 100;
                break;
        }


        const config = { //TODO make these values statewide
            host: ipAddressRaspberryPi,     
            port: 22,
            username: "ubuntu",
            password: "password",
        }
        if (!socketCtx.isConnected) {
            socketCtx.Connect(config); //set assignment number and title
            assignmentCtx.setTitleImageHandler(questionData.title);
            assignmentCtx.setAssignmentImageHandler(questionData.assignment_number);
            assignmentCtx.setSubjectImageHandler(questionData.subject);

            // Nadenken welke snelheid ik hier wil sturen, als ze upgraden veranderd de snelheid weer
            // Misschien dat ze hieruit de juiste upgrades kunnen krijgen -> zet dan hun energie voor de race per upgrade erbij. 
            navigation.navigate('Assignments', 
                { screen: 'Controller',    
                    params: {
                        displayNumber: 1,
                        motorStand: motorStand,
                        command: command
                    },
                }
            ) 
        }
        setShowMeasurementModal(false)
    }
    const height = questionData.subject === "CAR" ? (Platform.OS === 'ios' ?  310 : 330) : (Platform.OS === 'ios' ?  250 : 270);

    return (
        <Modal
        visible={showMeasurementModal}
        transparent
        animationType="fade"
        >
            <BlurWrapper 
            style={styles.modalContainer} 
            intensity={20}
            customColor={'rgba(40,40,72, 0.95)'}>
             <View style={[styles.modal, {height: height}]}>
                    <View style={styles.closeIcon}>
                        <Icon 
                        icon="close-circle"
                        size={25}
                        color={ColorsGray.gray700}
                        onPress={() => closeHandler()}
                        />
                    </View>
                    <Text style={{fontSize: 21, marginBottom: 15, color: ColorsBlue.blue50}}>Kies Een Meting</Text>
                    {questionData.subject === "MOTOR" && 
                        <>
                            <TouchableOpacity
                            onPress={() => redirectToMeasurementHandler('1')}
                            style = {styles.button}>
                                <Text style = {styles.buttonText}>Constante Snelheid</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            onPress={() => redirectToMeasurementHandler('2')}
                            style = {styles.button}>
                                <Text style = {styles.buttonText}>Constante Versnelling</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            onPress={() => redirectToMeasurementHandler('3')}
                            style = {styles.button}>
                                <Text style = {styles.buttonText}>Zelf Besturen</Text>
                            </TouchableOpacity>
                        </>
                        }
                    {questionData.subject === "CAR" && 
                        <>
                            <TouchableOpacity
                            onPress={() => redirectToMeasurementHandler('4')}
                            style = {styles.button}>
                                <Text style = {styles.buttonText}>Meting Motorstand 1</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            onPress={() => redirectToMeasurementHandler('5')}
                            style = {styles.button}>
                                <Text style = {styles.buttonText}>Meting Motorstand 2</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            onPress={() => redirectToMeasurementHandler('6')}
                            style = {styles.button}>
                                <Text style = {styles.buttonText}>Meting Motorstand 3</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            onPress={() => redirectToMeasurementHandler('7')}
                            style = {styles.button}>
                                <Text style = {styles.buttonText}>Meting Motorstand 4</Text>
                            </TouchableOpacity>
                        </>
                    }
             </View>
            </BlurWrapper>
        </Modal>
    )
}

export default CustomMeasurementModal;


const styles = StyleSheet.create({
    modal: {
        width: '70%',
        borderRadius: 5,
        borderWidth: 0.7,
        borderColor: ColorsBlue.blue700,
        backgroundColor: ColorsBlue.blue1100,
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },    
    closeIcon: {
        position: 'absolute',
        top: 5,
        left: 5
    },
    button: {
        backgroundColor: ColorsBlue.blue1200,
        borderRadius: 5,
        padding: 13,
        width: 200,
        marginVertical: 5,
        alignItems: 'center',
        borderColor: ColorsBlue.blue700,
        borderWidth: 1,
        elevation: 5,
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
    },
    buttonText: {
        color: ColorsBlue.blue100,
        textAlign: 'center',
        fontSize: 16

    }
})
