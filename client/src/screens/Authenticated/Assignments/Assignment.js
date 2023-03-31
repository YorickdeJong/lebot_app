import { StyleSheet, View} from "react-native"
import React, { useContext, useState } from "react";
import QuestionsTile from "../../../components/assignments/questions/QuestionsTile";
import QuestionSelection from "../../../components/assignments/questions/QuestionSelection";
import { AssignmentContext } from "../../../store/assignment-context";
import { AssignmentDetailsContext } from "../../../store/assignment-Details-context";
import { useIsFocused } from "@react-navigation/native";
import InformationQuestionsScreen from "../../../components/assignments/questions/InformationQuestionsScreen";

function getFirstCompletedAssignment(assignmentDetailsCtx, title, length) {
    for (let i = 1; i < length; i++){
        if(!assignmentDetailsCtx.getCompletionStatusAssignment(i, title)) {
            return i
        } 
    }
    return 1;
}

function Assignment({title, tabIndex, currentIndex }) {
    const assignmentCtx = useContext(AssignmentContext); //how to now the subject here?
    const assignmentDetailsCtx = useContext(AssignmentDetailsContext)
    const assignmentTopic = assignmentCtx.filterSpecificTitle(title);
    const assignmentStartingNumber = getFirstCompletedAssignment(assignmentDetailsCtx, title, assignmentTopic.length)
    const [assignmentNumber, setAssignmentNumber] = useState(assignmentStartingNumber) //TODO make default to be the first not yet completed assignment
    const isFocused = tabIndex === currentIndex;

    console.log(`AssignmentNumber: ${assignmentNumber}`)
    console.log(`AssignmentTopic: ${assignmentTopic}`)


    return (
        <InformationQuestionsScreen 
        assignmentTopic={assignmentTopic} 
        assignmentNumber={assignmentNumber}
        isFocused={isFocused}/>
    )
}

export default Assignment


const styles = StyleSheet.create({
    container:{
        flex: 1,
    },  
})