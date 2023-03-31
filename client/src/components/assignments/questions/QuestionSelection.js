
import { useContext } from "react";
import { StyleSheet, View } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { ColorsBlue, ColorsDarkestBlue, ColorsLighterGold, ColorsTile } from "../../../constants/palet";
import { AssignmentDetailsContext } from "../../../store/assignment-Details-context";
import Icon from "../../Icon";

function QuestionSelection({onPressAssignment, assignmentNumber, assignmentTopic}) {
    const assignmentDetailsCtx = useContext(AssignmentDetailsContext);

    function renderAssignmentNumbers(itemData){
        const completionStatus = assignmentDetailsCtx.getCompletionStatusAssignment(itemData.item.assignment_number, itemData.item.title)
        const iconName =  completionStatus?  
                    itemData.item.assignment_number + "-circle-outline" : itemData.item.assignment_number
        return (
            <View style = {styles.iconBox}>
                <Icon 
                icon = {"numeric-" + iconName}
                size = {completionStatus ? 36: 45}
                color = {assignmentNumber === itemData.item.assignment_number 
                    ? ColorsBlue.blue400 : ColorsBlue.blue700}
                onPress = {onPressAssignment.bind(this, itemData.item.assignment_number)}
                differentDir
                />
            </View>

        )
    }


    return (
        <View style = {styles.assignmentNumber}>
            <FlatList 
            keyExtractor={item => item.assignment_id}
            showsHorizontalScrollIndicator={false}
            horizontal
            data = {assignmentTopic}
            renderItem = {renderAssignmentNumbers}
            />

            
        </View>
    )
}

export default QuestionSelection


const styles = StyleSheet.create({
    iconBox: {
        marginHorizontal: 15,
        justifyContent: 'center'
    },
    assignmentNumber: {
        borderBottomColor: ColorsBlue.blue700,
        borderBottomWidth: 0.8,
        borderTopColor: ColorsBlue.blue700,
        borderTopWidth: 0.8,
        height: 50,
        backgroundColor: ColorsDarkestBlue.blue1000,
    },
})