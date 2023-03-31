


import { StyleSheet, View,  Modal, Text, ImageBackground, Pressable, Alert, } from "react-native"
import Icon from "../../Icon"
import { ColorsBlue } from "../../../constants/palet"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from 'expo-blur';
import { useContext, useEffect, useState } from "react";
import { ChartContext } from "../../../store/chart-context";
import { AssignmentContext } from "../../../store/assignment-context";
import { useNavigation } from "@react-navigation/native";
import ChooseTitleModal from "./ChooseTitleModal";
import ChooseAssignmentModal from "./ChooseAssignmentDetailsModal";
import LoadingChat from "../../UI/LoadingChat";
import PressableButton from "./PressableButton";



function AssignmentDetailsModal({headerHeight}) {
    const assignmentCtx = useContext(AssignmentContext);
    const navigation = useNavigation();
    const [showChooseAssignmentDetailsModal, setShowChooseAssignmentDetailsModal] = useState(false);
    const [showChooseTitleDetailsModal, setShowChooseTitleDetailsModal] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    function navigateHandler() {
        if (assignmentCtx.assignmentImage.title === '' || assignmentCtx.assignmentImage.assignment_number === 0){
            Alert.alert('Please choose a subject and assignment number');
            return
        }
        setIsLoaded(true);
        setShowChooseAssignmentDetailsModal(false); // Close the modal
        navigation.navigate('Controller') // Bring up modal first and then navigate to controller
        // setIsLoaded(false);
    }
    
    function titleHandler() {
        setShowChooseTitleDetailsModal(true);
    }
    
    function assignmentHandler() {
        if (!assignmentCtx.assignmentImage.title){
            Alert.alert('Please choose a subject first');
            return
        }
        setShowChooseAssignmentDetailsModal(true);
    }

    if (showChooseTitleDetailsModal){
       return(
            <ChooseTitleModal 
            headerHeight={headerHeight}
            setShowChooseTitleDetailsModal={setShowChooseTitleDetailsModal}
            />
       )
    }
    
    if (showChooseAssignmentDetailsModal){
           return(
            <ChooseAssignmentModal 
            headerHeight={headerHeight}
            setShowChooseAssignmentDetailsModal={setShowChooseAssignmentDetailsModal}
            />
       )
    }

    if (isLoaded){
        return(
            <LoadingChat />
        )
    }

    return (
        <Modal 
        animationType="fade"
        transparent
        >
            <ImageBackground 
                source={require('./../../../../assets/chatbackground.png')} 
                style={{flex: 1}}
                imageStyle={{opacity: 0.15, flex: 1}}
                onLoad={() => setImageLoaded(true)}
            >
                {imageLoaded && (
                <BlurView style={styles.modalContainer} intensity={15}>
                    <LinearGradient 
                    style = {[styles.modal, { marginTop: headerHeight }]}
                    colors={[ColorsBlue.blue1300, ColorsBlue.blue1000]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                        >
                        <ImageBackground 
                        source={require('./../../../../assets/equations4.jpg')} 
                        style={styles.modalImage}
                        imageStyle={{opacity: 0.15, flex: 1}}
                        >
                      
                            <PressableButton 
                            onPress={titleHandler}
                            text="Choose Title"
                            />
                            

                            <PressableButton 
                            onPress={assignmentHandler}
                            text="Assignment Number"
                            />

                            <View style = {styles.iconContainer}>
                                <Icon 
                                size = {50}
                                icon = "checkmark-circle-outline"
                                color = {ColorsBlue.blue200}
                                onPress = {navigateHandler}
                                />
                            </View>
                        </ImageBackground>
                    </LinearGradient>
                </BlurView>
                )}
            </ImageBackground>
        </Modal>
    )
}

export default AssignmentDetailsModal

const styles = StyleSheet.create({
    icon: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        margin: 5
    },  
    modal: {
        width: '90%',
        height: 300,
        marginBottom: 70,
        borderRadius: 5,
        borderWidth: 0.7,
        borderColor: ColorsBlue.blue700,
        elevation: 4, 
        shadowColor: ColorsBlue.blue200,
        shadowOffset: {height: 1, width: 0},
        shadowRadius: 6,
        shadowOpacity: 0.7,
    },
    modalContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    title: {
        color: ColorsBlue.blue200,
        fontSize: 26,
        textAlign: 'center',
    },
    chartToggleContainer: {
        marginLeft: 0,
    },
    iconContainer:{ 
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 15,
        elevation: 4, 
        shadowColor: ColorsBlue.blue700,
        shadowOffset: {height: 1, width: 0},
        shadowRadius: 4,
        shadowOpacity: 1,
    },
    button: {
        margin: 15,
        width: "80%",
        height: 60,
        borderRadius: 6,
        borderColor: ColorsBlue.blue700,
        borderWidth: 1,
        elevation: 4, 
        shadowColor: ColorsBlue.blue900,
        shadowOffset: {height: 1, width: 0},
        shadowRadius: 4,
        shadowOpacity: 0.7,
    },
    colorGradient: {
        borderRadius: 6, 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pressed: {
        opacity: 0.5
    },
    modalImage: {
        flex: 1, 
        paddingTop: 40,
        justifyContent: 'center',
    }
})