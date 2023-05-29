
import { View, Text, StyleSheet, Pressable} from "react-native";
import {useContext, useState} from 'react'
import { LinearGradient } from "expo-linear-gradient"
import Icon from "../../Icon";
import { CarContext } from "../../../store/car-context";
import { AssignmentDetailsContext } from "../../../store/assignment-Details-context";
import { ColorsBlue, ColorsOrange} from "../../../constants/palet";
import { BlurView } from "expo-blur";
import BlurWrapper from "../../UI/BlurViewWrapper";


function AssignmentTile ({onPress, title, subject, icon, 
    iconColor, textColor, assignment_number, completionData, colorDark, colorLight, status, id, marginLeft}) {
    const assignmentDetailsCtx = useContext(AssignmentDetailsContext);

    const completion_status = assignmentDetailsCtx.getCompletionStatusAssignment(assignment_number, title);
    const carCtx = useContext(CarContext)

    let colors;
    let currentStatus;
    let completionStatus; 
    let rewardColor;
    let finishedAssignmentsColor;
    let colorText;
    let colorIcon; 
    let completedAssignments; 
    let borderColor;
    let shadowOpacity;
    let tint;
    let intensity;
    let customColor;


    switch(subject){
        case 'Speed':
            completionStatus = carCtx.upgradeLog.Speed[id - 1] 
            colors = completionStatus ? colorDark : colorLight;
            currentStatus = carCtx.upgradeLog.Speed[id - 1] ? status[1] : ": €" + status[0]
            rewardColor = iconColor;
            borderColor =  completionStatus ? ColorsBlue.blue1400 : ColorsBlue.blue1400;
            shadowOpacity = 0.2
            colorText = textColor
            colorIcon = iconColor
            tint = completionStatus ? 'dark' : 'light' 
            intensity = completionStatus ? 60 : 12
            customColor = completionStatus ? 'rgba(25,40,70,0.8)' : 'rgba(55,60,104,0.8)'
            break;

        case 'Acc':
            completionStatus = carCtx.upgradeLog.Acc[id - 1]
            colors = completionStatus ? colorDark : colorLight;
            currentStatus = carCtx.upgradeLog.Acc[id - 1] ? status[1] : (": €" + status[0]);
            rewardColor = iconColor;
            borderColor = completionStatus ? ColorsBlue.blue1400 : ColorsBlue.blue1400;
            shadowOpacity = 0.2
            colorText = textColor
            colorIcon = iconColor
            tint = completionStatus ? 'dark' : 'light'
            intensity = completionStatus ? 60 : 12
            customColor = completionStatus ? 'rgba(25,30,70,0.8)' : 'rgba(55,60,104,0.8)'
            break;

        case 'Afstand':
            completionStatus = carCtx.upgradeLog.Handling[id - 1]
            colors = completionStatus ? colorDark : colorLight;
            currentStatus = carCtx.upgradeLog.Handling[id - 1] ? status[1] : (": €" + status[0]);
            rewardColor = iconColor;
            borderColor = completionStatus ? ColorsBlue.blue1400 : ColorsBlue.blue1400;
            shadowOpacity = 0.2
            colorText = textColor
            colorIcon = iconColor
            tint = completionStatus ? 'dark' : 'light'
            intensity = completionStatus ? 60 : 12
            customColor = completionStatus ? 'rgba(25,30,70,0.8)' : 'rgba(55,60,104,0.8)'
            break;

        case 'Wheels':
            completionStatus = carCtx.upgradeLog.Wheels[id - 1]
            colors = completionStatus ? colorDark : colorLight;
            currentStatus = carCtx.upgradeLog.Wheels[id - 1] ? status[1] : (": €" + status[0]);
            rewardColor = iconColor
            borderColor = completionStatus ? ColorsOrange.orange800 : ColorsOrange.orange600;
            shadowOpacity = 0.2
            colorText = textColor
            colorIcon = iconColor
            tint = completionStatus ? 'dark' : 'light'
            intensity = completionStatus ? 60 : 12
            customColor = completionStatus ? 'rgba(25,30,70,0.8)' : 'rgba(55,60,104,0.8)'
            break;

        case 'MOTOR':
            completionStatus = completionData.totalCompletedAssignments === completionData.totalAssignments;
            completedAssignments = "Vol: " + completionData.totalCompletedAssignments + "/" + completionData.totalAssignments;
            colors = completionStatus ? colorDark : colorLight;
            currentStatus = completionStatus ? "COMPLETED" : ": €" + completionData.acquiredCurrency + "/" + completionData.totalCurrency;
            borderColor = completionStatus ? ColorsBlue.blue400 : ColorsBlue.blue700;
            shadowOpacity = 0.5
            rewardColor = ColorsBlue.blue50; //CHANGE 
            finishedAssignmentsColor = ColorsBlue.blue50; //CHANGE
            colorText = ColorsBlue.blue50;
            colorIcon = ColorsBlue.blue50;
            tint = 'dark'
            intensity = 70
            customColor = 'rgba(10, 22, 70, 0.8)'
            break;

        case 'LED': 
            completionStatus = completionData.totalCompletedAssignments === completionData.totalAssignments;
            completedAssignments = "Vol: " + completionData.totalCompletedAssignments + "/" + completionData.totalAssignments;
            colors = completionStatus ? colorDark : colorLight;
            currentStatus = completionStatus ? "COMPLETED" : ": €" + completionData.acquiredCurrency + "/" + completionData.totalCurrency;
            borderColor = ColorsBlue.blue700;
            shadowOpacity = 0.5
            rewardColor = ColorsBlue.blue50; //CHANGE
            finishedAssignmentsColor = ColorsBlue.blue50; //CHANGE
            colorText = ColorsBlue.blue50;
            colorIcon = ColorsBlue.blue50;
            tint = 'dark'
            intensity = 70
            customColor = 'rgba(10, 22, 70, 0.8)'
            break;

        case 'CAR':
            completionStatus = completionData.totalCompletedAssignments === completionData.totalAssignments;
            completedAssignments = "Vol: " + completionData.totalCompletedAssignments + "/" + completionData.totalAssignments;
            colors = completionStatus ? colorDark : colorLight;
            currentStatus = completionStatus ? "COMPLETED" : ": €" + completionData.acquiredCurrency + "/" + completionData.totalCurrency;
            borderColor = ColorsBlue.blue700; 
            shadowOpacity = 0.5
            rewardColor = ColorsBlue.blue50; //CHANGE
            finishedAssignmentsColor = ColorsBlue.blue50; //CHANGE
            colorText = ColorsBlue.blue50;
            colorIcon = ColorsBlue.blue50;
            tint = 'dark'
            intensity = 70
            customColor = 'rgba(10, 22, 70, 0.8)'
            break;
    }

    let index;

    if (completion_status === true) {
        index = 1;
    }

    const addStyleIcon = {
        shadowOffset: {height: 2, width: 1},
        shadowRadius: 2,
        shadowOpacity: 1,
        shadowColor: 'black',
    }



    return ( 
            <Pressable
                onPress={onPress}
                style={({
                    pressed
                }) => [styles.tile, marginLeft && {marginLeft: 0}, {backgroundColor: Platform.OS === 'android' && `rgba(1,1,1, ${shadowOpacity})`}, pressed && styles.pressed]}
            >
                <BlurWrapper  
                intensity={intensity} 
                tint = {tint} 
                style = {[styles.colorGradient, {overflow: 'hidden'}]} 
                customColor = {customColor}
                >

                    <View style={[styles.titlecontainer, {marginTop: !completionData ? 20  : 5 }]}>

                        <Text 
                            style={[styles.title, {color: colorText}]}
                            >
                            {title}
                        </Text>
                    </View> 
                    <View style={styles.iconStyle}>
                        <Icon 
                            size={40}
                            color={colorIcon}
                            icon={icon}
                            differentDir={true}
                            onPress = {onPress}
                            addStyle = {addStyleIcon}
                        />
                    </View>
                    <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}>
                        {/* Logic to display cash icon */}
                        {(!completionStatus) && 
                        <Icon 
                        icon="cash-multiple"
                        size = {12}
                        color = {rewardColor}
                        differentDir={true}
                        addStyle={addStyleIcon}
                        />}
                        <Text 
                            style={[styles.text, {color: rewardColor, }, addStyleIcon]}>
                            {currentStatus}
                        </Text>
                    
                    </View> 
                        <Text 
                            style={[styles.text,  {color: finishedAssignmentsColor, marginTop: 2, marginBottom: 3}, addStyleIcon ]}>
                            {status ? null : completedAssignments}
                        </Text>

                </BlurWrapper>
            </Pressable>
    )
}

export default AssignmentTile


const styles = StyleSheet.create({
    colorGradient: {
        borderRadius: 20,
        borderColor: `rgba(10, 10, 10, 0.4)`,
        borderWidth: 0.4,
        shadowOffset: {height: 2, width: 1},
        shadowRadius: 4,
        shadowOpacity: 1,
        shadowColor: 'black',
        width: 100,
        height: 150,
    },
    pressed: {
        opacity: 0.7,
        borderRadius: 20,
    },  
    titlecontainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center', 
        marginTop: 5,
    },  
    tile: {
        height: 153,
        width: 103,
        marginHorizontal: 8,
        marginBottom: 20,
        marginTop: 20,
        borderRadius: 20,
        shadowOffset: {height: 2, width: 1},
        shadowRadius: 3,
        shadowOpacity: 0.8,
        shadowColor: 'black',
        alignSelf: 'center',
    },
    title: {
        marginTop: 6,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: ColorsBlue.blue900,
        shadowOffset: {height: 2, width: 1},
        shadowRadius: 1,
        shadowOpacity: 0.7,
        shadowColor: 'black',
    },
    text:{
        textAlign: 'center',
        fontWeight: 'bold', 
        fontSize: 10
    },
    iconStyle:{
        alignItems: 'center',
        justifyContent: 'center',
        margin: 12,

    },
    completion: {
        marginTop: 2,
        color: ColorsBlue.error300
    },
    subject: {
        textAlign: 'center',
    },
})