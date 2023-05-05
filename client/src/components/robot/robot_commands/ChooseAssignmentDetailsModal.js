import { StyleSheet, View,  Modal, Text, ImageBackground, Pressable, FlatList, } from "react-native"
import Icon from "../../Icon"
import { ColorsBlue } from "../../../constants/palet"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from 'expo-blur';
import { useContext, useState } from "react";
import { AssignmentContext } from "../../../store/assignment-context";
import PressableButton from "./PressableButton";


function ChooseAssignmentModal({headerHeight, setShowChooseAssignmentDetailsModal}) {
    const assignmentCtx = useContext(AssignmentContext);

    function renderAssignmentList({item}) {
        function assignmentHandler() {
            assignmentCtx.setAssignmentImageHandler(item)  
            setShowChooseAssignmentDetailsModal(false);  
        }
        
        return (
            <PressableButton 
            onPress={assignmentHandler}
            text={"Assignment Number: " +  item}
            />
        )
    }
    
    const assignments = assignmentCtx.assignments
    .filter(
        (assignment) => (
            console.log(assignment.title),
            assignment.title === assignmentCtx.assignmentImage.title
            )
        )
    .map((assignment) => assignment.assignment_number)

    return(       
        <Modal 
            transparent>
            <ImageBackground 
                source={require('./../../../../assets/chatbackground.png')} 
                style={{flex: 1}}
                imageStyle={{opacity: 0.15, flex: 1}}
            >
                <BlurView style={styles.modalContainer} intensity={15}>
                    <LinearGradient 
                    style = {[styles.modal, { marginTop: headerHeight }]}
                    colors={[ColorsBlue.blue1200, ColorsBlue.blue1000]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                        >   
                        <ImageBackground 
                        source={require('./../../../../assets/equations4.jpg')} 
                        style={styles.modalImage}
                        imageStyle={{opacity: 0.15, flex: 1}}
                        >
                        <View style={{flex: 1}}>
                            <Text style={styles.subject}>{assignmentCtx.assignmentImage.title}</Text>
                            <FlatList 
                            data = {assignments}
                            keyExtractor={(item, index) => index}
                            renderItem = {renderAssignmentList}
                            showsHorizontalScrollIndicator={false}
                            />
                        </View>
                        </ImageBackground>
                    </LinearGradient>
                </BlurView>
            </ImageBackground>
        </Modal>
    )
}

export default ChooseAssignmentModal

const styles = StyleSheet.create({
    modal: {
        width: '90%',
        height: "80%",
        borderRadius: 5,
        borderWidth: 0.7,
        marginBottom: 5,
        borderColor: ColorsBlue.blue700,
        justifyContent: 'center',
        elevation: 4, 
        shadowColor: ColorsBlue.blue900,
        shadowOffset: {height: 1, width: 0},
        shadowRadius: 4,
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
    button: {
        margin: 15,
        height: 60,
        marginHorizontal: 25,
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
    },
    pressed: {
        opacity: 0.5
    },
    modalImage: {
        flex: 1, 
        paddingTop: 20,
        justifyContent: 'center',
    },
    subject: {
        color: ColorsBlue.blue200,
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 10,
        textAlign: 'center',
        textShadowColor: ColorsBlue.blue500, // set text shadow color
        textShadowOffset: { width: 0, height: 0 }, // set text shadow offset
        textShadowRadius: 10, // set text shadow radius
        fontWeight: 'bold',
    }
})