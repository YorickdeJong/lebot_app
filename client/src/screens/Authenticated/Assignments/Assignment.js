import { StyleSheet, View} from "react-native"
import React, { useContext, useState } from "react";
import QuestionsTile from "../../../components/assignments/QuestionsTile";
import QuestionSelection from "../../../components/assignments/QuestionSelection";
import { AssignmentContext } from "../../../store/assignment-context";
import { AssignmentDetailsContext } from "../../../store/assignment-Details-context";

function getFirstCompletedAssignment(assignmentDetailsCtx, title, length) {
    for (let i = 1; i < length; i++){
        if(!assignmentDetailsCtx.getCompletionStatusAssignment(i, title)) {
            return i
        } 
    }
    return 1;
}



function Assignment({navigation, route}) {
    const { title } = route.params;
    const assignmentCtx = useContext(AssignmentContext); //how to now the subject here?
    const assignmentTopic = assignmentCtx.filterSpecificTitle(title);
    const assignmentDetailsCtx = useContext(AssignmentDetailsContext)
    const assignmentStartingNumber = getFirstCompletedAssignment(assignmentDetailsCtx, title, assignmentTopic.length)
    const [assignmentNumber, setAssignmentNumber] = useState(assignmentStartingNumber) //TODO make default to be the first not yet completed assignment

    function onPressAssignment(inputNumber) {
        setAssignmentNumber(inputNumber)
    }

    // passes the correct data when a tile is clicked
    React.useLayoutEffect(() => {
        navigation.setOptions({
        title: title,
        });
    }, [navigation, title]);

    return (
    <View style = {styles.container}>
        <QuestionSelection 
        onPressAssignment = {onPressAssignment}
        assignmentNumber={assignmentNumber}
        assignmentTopic={assignmentTopic}/>
        <QuestionsTile 
        assignmentNumber={assignmentNumber}
        assignmentTopic={assignmentTopic}/>
        {/* Hoe ga ik hier de juiste opgave weergeven? */}
    </View>
    )
}

export default Assignment


const styles = StyleSheet.create({
    container:{
        flex: 1,
    },  
})