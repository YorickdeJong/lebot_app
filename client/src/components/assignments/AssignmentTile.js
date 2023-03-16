
import { ColorsBlue, ColorsBronze, ColorsGreen, ColorsLighterGold, ColorsOrange, ColorsPurple, ColorsRed, ColorsTile, StoreColors} from "../../constants/palet";
import { View, Text, StyleSheet, Pressable} from "react-native";
import {useContext} from 'react'
import { LinearGradient } from "expo-linear-gradient"
import Icon from "../Icon";
import { CarContext } from "../../store/car-context";
import { AssignmentDetailsContext } from "../../store/assignment-Details-context";
import { AssignmentContext } from "../../store/assignment-context";


function AssignmentTile ({onPress, title, subject, icon, 
    iconColor, textColor, assignment_number, completionData, colorDark, colorLight, status, id}) {
    const assignmentDetailsCtx = useContext(AssignmentDetailsContext);
    const assignmentsCtx = useContext(AssignmentContext)


    const completion_status = assignmentDetailsCtx.getCompletionStatusAssignment(assignment_number, title);
    const carCtx = useContext(CarContext)
    
    let colors;
    let currentStatus;
    let completionStatus 
    let rewardColor;
    let finishedAssignmentsColor;

    switch(subject){
        case 'Speed':
            completionStatus = carCtx.upgradeLog.Speed[id - 1] 
            colors = completionStatus ? colorDark : colorLight;
            currentStatus = carCtx.upgradeLog.Speed[id - 1] ? status[1] : ": €" + status[0]
            rewardColor = ColorsTile.blue700;
            borderColor =  completionStatus ? ColorsTile.blue900 : ColorsTile.blue600;
            shadowColor = ColorsBlue.blue900;
            break;
        case 'Acc':
            completionStatus = carCtx.upgradeLog.Acc[id - 1]
            colors = completionStatus ? colorDark : colorLight;
            currentStatus = carCtx.upgradeLog.Acc[id - 1] ? status[1] : (": €" + status[0]);
            rewardColor = ColorsPurple.purple700;
            borderColor = completionStatus ? ColorsPurple.purple700 : ColorsPurple.purple600;
            shadowColor = ColorsPurple.purple900;
            break;
        case 'Handling':
            completionStatus = carCtx.upgradeLog.Handling[id - 1]
            colors = completionStatus ? colorDark : colorLight;
            currentStatus = carCtx.upgradeLog.Handling[id - 1] ? status[1] : (": €" + status[0]);
            rewardColor = ColorsRed.red700;
            borderColor = completionStatus ? ColorsRed.red700 : ColorsRed.red600;
            shadowColor = ColorsRed.red900;
            break;
        case 'Wheels':
            completionStatus = carCtx.upgradeLog.Wheels[id - 1]
            colors = completionStatus ? colorDark : colorLight;
            currentStatus = carCtx.upgradeLog.Wheels[id - 1] ? status[1] : (": €" + status[0]);
            rewardColor = ColorsOrange.orange700;
            borderColor = completionStatus ? ColorsOrange.orange800 : ColorsOrange.orange600;
            shadowColor = ColorsOrange.orange900;
            break;
        case 'Physics':
            completionStatus = completionData.totalCompletedAssignments === completionData.totalAssignments;
            completedAssignments = "Vol: " + completionData.totalCompletedAssignments + "/" + completionData.totalAssignments;
            colors = completionStatus ? colorDark : colorLight;
            currentStatus = completionStatus ? "COMPLETED" : ": €" + completionData.acquiredCurrency + "/" + completionData.totalCurrency;
            rewardColor = ColorsBlue.blue50;
            finishedAssignmentsColor = ColorsBlue.blue50;
            borderColor = completionStatus ? ColorsBlue.blue800 : ColorsBlue.blue700;
            shadowColor = ColorsBlue.blue900;
            break;
        case 'Mathematics': 
            completionStatus = completionData.totalCompletedAssignments === completionData.totalAssignments;
            completedAssignments = "Vol: " + completionData.totalCompletedAssignments + "/" + completionData.totalAssignments;
            colors = completionStatus ? colorDark : colorLight;
            currentStatus = completionStatus ? "COMPLETED" : ": €" + completionData.acquiredCurrency + "/" + completionData.totalCurrency;
            rewardColor = ColorsTile.mathematics;
            finishedAssignmentsColor = ColorsTile.mathematics
            borderColor = ColorsBlue.blue700;
            shadowColor = ColorsBlue.blue900;
            break;
    }

    const locations = colors.map((_, index) => index / (colors.length - 1));

    
    const colorIcon = iconColor ? iconColor : ColorsTile.mathematics;
    const colorText = textColor ? textColor : ColorsTile.mathematics;
    

    let index = 0;
    


    if (completion_status === true) {
        index = 1;
    }

    return ( 
        <Pressable
            onPress={onPress}
            style={({
                pressed
            }) => [styles.tile, {borderColor, shadowColor: shadowColor}, pressed && styles.pressed]}
        >
            <LinearGradient 
                colors={colors} 
                style={styles.colorGradient}
                locations={locations}
                start={{ 
                    x: 0, 
                    y: 0 
                }}
                end={{ 
                    x: 1, 
                    y: 1 
                }}
            >
  
                <View style={styles.titlecontainer}>

                    <Text 
                        style={[styles.title, subject === "Physics" ? 
                        {color: ColorsBlue.blue50} : {color: colorText}]
                    }>
                        {title}
                    </Text>
                </View> 
                <View style={styles.iconStyle}>
                    <Icon 
                        size={45}
                        color={subject === "Physics" ? 
                            ColorsBlue.blue50 : colorIcon}
                        icon={icon}
                        differentDir={true}
                        onPress = {onPress}
                    />
                </View>
                <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    {/* Logic to display cash icon */}
                    {(!completionStatus) && 
                    <Icon 
                    icon="cash-multiple"
                    size = {12}
                    color = {rewardColor}
                    differentDir={true}
                    />}
                    <Text 
                        style={[styles.text, {color: rewardColor}]}>
                        {currentStatus}
                    </Text>
                   
                </View> 
                    <Text 
                        style={[styles.text,  {color: finishedAssignmentsColor, marginTop: 5} ]}>
                        {status ? null : completedAssignments}
                    </Text>
            </LinearGradient>
        </Pressable>
    )
}

export default AssignmentTile


const styles = StyleSheet.create({
    colorGradient: {
        borderRadius: 4, 
        flex: 1
    },
    pressed: {
        opacity: 0.7
    },  
    titlecontainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center', 
        marginTop: 15,
    },  
    tile: {
        height: 155,
        width: 100,
        marginHorizontal: 8,
        marginBottom: 20,
        marginTop: 20,
        borderRadius: 4,
        elevation: 4, 
        
        shadowOffset: {height: 1, width: 0},
        shadowRadius: 5,
        shadowOpacity: 0.7,
        borderWidth: 0.9,
    },
    title: {
        marginTop: 6,
        fontSize: 15,
        fontWeight: 'bold',
        color: ColorsBlue.blue900
    },
    text:{
        textAlign: 'center',
        fontWeight: 'bold', 
        fontSize: 10
    },
    iconStyle:{
        alignItems: 'center',
        justifyContent: 'center',
        margin: 15
    },
    completion: {
        marginTop: 2,
        color: ColorsBlue.error300
    },
    subject: {
        textAlign: 'center',
    },
})