import { StyleSheet, View,  Modal, Text, ImageBackground, Pressable, FlatList, } from "react-native"
import Icon from "../../Icon"
import { ColorsBlue } from "../../../constants/palet"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from 'expo-blur';
import { useContext, useEffect, useState } from "react";
import { ChartContext } from "../../../store/chart-context";
import { useNavigation } from "@react-navigation/native";
import { AssignmentContext } from "../../../store/assignment-context";
import PressableButton from "./PressableButton";


function ChooseTitleModal({headerHeight, setShowChooseTitleDetailsModal}) {
    const assignmentCtx = useContext(AssignmentContext);

    function renderAssignmentList({item}) {
        function titleHandler() {
            assignmentCtx.setTitleImageHandler(item)  
            setShowChooseTitleDetailsModal(false);  
        }
        
        return (
            <PressableButton 
            onPress={titleHandler}
            text={item}
            />
        )
    }
    
    useEffect(() => {
        console.log(assignmentCtx.assignmentImage.assignment_number)
        assignmentCtx.setAssignmentImageHandler(0)
    }, [assignmentCtx.assignmentImage.title])


    const uniqueTitles = assignmentCtx.assignments.reduce((titles, assignment) => {
        if (!titles.includes(assignment.title)) {
            titles.push(assignment.title);
        }
        return titles;
    }, []);


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
                        source={require('./../../../../assets/equations1.jpg')} 
                        style={styles.modalImage}
                        imageStyle={{opacity: 0.15, flex: 1}}
                        >
                        <View style={{flex: 1}}>
                            <FlatList 
                            data = {uniqueTitles}
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

export default ChooseTitleModal

const styles = StyleSheet.create({
    modal: {
        width: '90%',
        height: "80%",
        paddingTop: 20,
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
        alignItems: 'center',
    },
    pressed: {
        opacity: 0.5
    },
    modalImage: {
        flex: 1, 
        justifyContent: 'center',

    }
})