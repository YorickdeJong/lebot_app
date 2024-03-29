import { StyleSheet, ImageBackground, } from "react-native"
import React, { useContext, useState } from "react";
import { AssignmentContext } from "../../../store/assignment-context";
import { AssignmentDetailsContext } from "../../../store/assignment-Details-context";
import InformationQuestionsScreenOne from "../../../components/assignments/screens/assignment_one/InformationQuestionsScreenOne";
import InformationQuestionsScreenTwo from "../../../components/assignments/screens/assignment_two/InformationQuestionsScreenTwo";
import InformationQuestionsScreenThree from "../../../components/assignments/screens/assignment_three/InformationQuestionsScreenThree";
import { LinearGradient } from "expo-linear-gradient";

function getFirstCompletedAssignment(assignmentDetailsCtx, title, length) {
    for (let i = 1; i < length; i++){
        if(!assignmentDetailsCtx.getCompletionStatusAssignment(i, title)) {
            return i
        } 
    }
    return 1;
}

// DISPLAYS INDIVIDUAL ASSIGNMENTS
function Assignment({title, tabIndex, currentIndex, subject, initSlideCount}) {
    const assignmentCtx = useContext(AssignmentContext); //how to now the subject here?
    const assignmentDetailsCtx = useContext(AssignmentDetailsContext)
    const assignmentTopic = assignmentCtx.filterSpecificTitle("Vragen Opdracht");
    const assignmentStartingNumber = getFirstCompletedAssignment(assignmentDetailsCtx, title, assignmentTopic.length)
    const [assignmentNumber, setAssignmentNumber] = useState(assignmentStartingNumber) //TODO make default to be the first not yet completed assignment
    const isFocused = tabIndex === currentIndex;

    return (

            isFocused &&
                <>
                    {subject === 'MOTOR' && 
                        <InformationQuestionsScreenOne 
                            assignmentTopic={assignmentTopic} 
                            assignmentNumber={assignmentNumber}
                            isFocused={isFocused}
                            initSlideCount = {initSlideCount ? initSlideCount : 0}
                        />
                    }
                    {subject === 'LED' && 
                        <InformationQuestionsScreenTwo
                            assignmentTopic={assignmentTopic} 
                            assignmentNumber={assignmentNumber}
                            isFocused={isFocused}
                            initSlideCount = {initSlideCount ? initSlideCount : 0}
                        />
                    }
                    {subject === 'CAR' && 
                        <InformationQuestionsScreenThree
                            assignmentTopic={assignmentTopic} 
                            assignmentNumber={assignmentNumber}
                            isFocused={isFocused}
                            initSlideCount = {initSlideCount ? initSlideCount : 0}
                        />
                    }

                </>
    )
}

export default React.memo(Assignment)


const styles = StyleSheet.create({
})