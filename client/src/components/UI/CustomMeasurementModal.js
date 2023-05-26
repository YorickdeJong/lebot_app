
import {Modal, View, StyleSheet, TextInput, TouchableOpacity, Text, Alert, ActivityIndicator} from 'react-native';
import Icon from "../Icon";
import { ColorsBlue, ColorsGray } from "../../constants/palet";
import { useContext, useState } from "react";
import { SocketContext } from "../../store/socket-context";
import BlurWrapper from "./BlurViewWrapper";
import { ipAddressRaspberryPi, ipAddressComputer } from '../../data/ipaddresses.data';
import { AssignmentContext } from '../../store/assignment-context';
import { useNavigation } from '@react-navigation/native';
import { UserProfileContext } from '../../store/userProfile-context';
import { CarContext } from '../../store/car-context';





function CustomMeasurementModal({showMeasurementModal, setShowMeasurementModal, questionData, subject}) {
    const assignmentCtx = useContext(AssignmentContext)
    const carCtx = useContext(CarContext);
    const userprofileCtx = useContext(UserProfileContext);
    const navigation = useNavigation();
    
    const assignment_number = questionData.assignment_number;
    const subject_title = questionData.subject;
    const assignment_title = questionData.title;
    const {id, school_id, class_id, group_id} = userprofileCtx.userprofile;
    const vel_max = carCtx.carProperties.speed;
    const vel_ramp = carCtx.carProperties.acceleration;

    function closeHandler(){
        setShowMeasurementModal(false)
    }

    function redirectToMeasurementHandler(type) {
        /*
        1: constant velocity
        2: constant acceleration
        3: free driving
        4: 40% of max speed
        5: 60% of max speed
        6: 80% of max speed
        7: 100% of max speed
        */
        let startScriptCommand = null
        switch (type) {
            case '1':
                //constant velocity
                startScriptCommand = `cd Documents/lebot_robot_code/catkin_work && roslaunch driver_bot_cpp constant_velocity.launch user_id:=${id} assignment_number:=${assignment_number} assignment_title:="${assignment_title}" subject_title:=${subject_title} school_id:=${school_id} class_id:=${class_id} group_id:=${group_id} ip_address:=${ipAddressComputer}`;
                break;
            case '2':
                //constant acceleration
                startScriptCommand = `cd Documents/lebot_robot_code/catkin_work && roslaunch driver_bot_cpp constant_acceleration.launch user_id:=${id} assignment_number:=${assignment_number} assignment_title:="${assignment_title}" subject_title:=${subject_title} school_id:=${school_id} class_id:=${class_id} group_id:=${group_id} ip_address:=${ipAddressComputer}`;
                break;
            case '3':
                //free driving
                startScriptCommand = `cd Documents/lebot_robot_code/catkin_work && roslaunch driver_bot_cpp encoder_movement.launch vel_max:=${50} vel_ramp:=${vel_ramp} user_id:=${id} school_id:=${id} assignment_number:=${assignment_number} assignment_title:="${assignment_title}" subject_title:=${subject_title} class_id:=${class_id} group_id:=${group_id} ip_address:=${ipAddressComputer}`;
                break;
            case '4':
                //power_movement
                startScriptCommand = `cd Documents/lebot_robot_code/catkin_work && roslaunch driver_bot_cpp power_movement.launch vel_max:=${40} vel_ramp:=${vel_ramp} user_id:=${id} assignment_number:=${assignment_number} assignment_title:="${assignment_title}" subject_title:=${subject_title} school_id:=${school_id} class_id:=${class_id} group_id:=${group_id} ip_address:=${ipAddressComputer}`;
                break;
            case '5':
                //power_movement
                startScriptCommand = `cd Documents/lebot_robot_code/catkin_work && roslaunch driver_bot_cpp power_movement.launch vel_max:=${60} vel_ramp:=${vel_ramp} user_id:=${id} assignment_number:=${assignment_number} assignment_title:="${assignment_title}" subject_title:=${subject_title} school_id:=${school_id} class_id:=${class_id} group_id:=${group_id} ip_address:=${ipAddressComputer}`;
                break;
            case '6':
                startScriptCommand = `cd Documents/lebot_robot_code/catkin_work && roslaunch driver_bot_cpp power_movement.launch vel_max:=${80} vel_ramp:=${vel_ramp} user_id:=${id} assignment_number:=${assignment_number} assignment_title:="${assignment_title}" subject_title:=${subject_title} school_id:=${school_id} class_id:=${class_id} group_id:=${group_id} ip_address:=${ipAddressComputer}`;
                break;
            case '7':
                startScriptCommand = `cd Documents/lebot_robot_code/catkin_work && roslaunch driver_bot_cpp power_movement.launch vel_max:=${100} vel_ramp:=${vel_ramp} user_id:=${id} assignment_number:=${assignment_number} assignment_title:="${assignment_title}" subject_title:=${subject_title} school_id:=${school_id} class_id:=${class_id} group_id:=${group_id} ip_address:=${ipAddressComputer}`;
                break;
        }


        assignmentCtx.setTitleImageHandler(questionData.title);
        assignmentCtx.setAssignmentImageHandler(questionData.assignment_number);
        assignmentCtx.setSubjectImageHandler(questionData.subject);

        // Nadenken welke snelheid ik hier wil sturen, als ze upgraden veranderd de snelheid weer
        // Misschien dat ze hieruit de juiste upgrades kunnen krijgen -> zet dan hun energie voor de race per upgrade erbij. 
        navigation.navigate('Assignments', 
            { screen: 'Controller',    
                params: {
                    displayNumber: 1,
                    startScriptCommand: startScriptCommand
                },
            }
        ) 

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
        borderRadius: 20,
        borderWidth: 0.7,
        borderColor: ColorsBlue.blue900,
        backgroundColor: ColorsBlue.blue1300,
        shadowColor: 'rgba(0,0,0,1)',
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
        borderRadius: 15,
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
