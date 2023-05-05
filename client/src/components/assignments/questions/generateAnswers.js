import { getSpecificAssignmentsDetail } from "../../../hooks/assignmentDetails";
import { getSpecificMeasurementResult } from "../../../hooks/measurement_results";
import { getSpecificPowerMeasurementResult } from "../../../hooks/power_measurement.hooks";
import { Alert } from "react-native";


export async function generateAnswerConstantSlope(answer, chartNumber, school_id, class_id, group_id, title, assignment_number, subject) {
    let specificAssignmentMeasurements
    
    try {
        if (subject === "MOTOR"){
            specificAssignmentMeasurements = await getSpecificMeasurementResult( //if subject -> fetch from power data
                school_id, 
                class_id, 
                group_id,
                title,
                assignment_number,
                subject
            );
        }
        if (subject === "CAR"){
            specificAssignmentMeasurements = await getSpecificPowerMeasurementResult( //if subject -> fetch from power data
                school_id, 
                class_id, 
                group_id,
                title,
                assignment_number,
                subject
            );
        }
    }
    catch (error) {
        console.log('no images yet');
        console.log(error)
    }
    
    console.log('chart data', specificAssignmentMeasurements[chartNumber - 1])
    const specific_data = specificAssignmentMeasurements[chartNumber - 1].velocity[0];

    console.log('Specific data:', specific_data);
    const sum = specific_data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const mean = sum / ( specific_data.length * 0.5 ); // replace 0.7 with measurement frequency

    console.log('Mean:', mean);

    const tolerance = 0.15;
    const lowerBound = answer * (1 - tolerance);
    const upperBound = answer * (1 + tolerance);

    const isWithinTolerance = mean >= lowerBound && mean <= upperBound;

    console.log('Is within tolerance:', isWithinTolerance);

    return isWithinTolerance;

}


export async function generateAnswerMotorQ3(answer, chartNumber, school_id, class_id, group_id, title, assignment_number, subject) {
    let prevAnsweredAssignment;

 
    try {
        prevAnsweredAssignment = await getSpecificAssignmentsDetail( //if subject -> fetch from power data
                school_id, 
                class_id, 
                group_id,
                34,
                subject
            );
    }
    catch(error) {
        console.log('no images yet');
        console.log(error)  
    }

    console.log('prevAnsweredAssignment', prevAnsweredAssignment)
    const answerQ2 = prevAnsweredAssignment.answers_open_questions[prevAnsweredAssignment.answers_open_questions.length - 1].answer;
    const tol = 0.05;

    console.log('prevAnswer', answerQ2)
    const lowerBound = answerQ2 * (1 - tol) * 600;
    const upperBound = answerQ2 * (1 + tol) * 600;

    const isWithinTolerance = answer  >= lowerBound && answer <= upperBound;

    console.log('is within tolerance:', isWithinTolerance)
    console.log('answer:', answer)
    return isWithinTolerance;
}


export async function generateAnswerMotorQ5(answer, chartNumber, school_id, class_id, group_id, title, assignment_number, subject) {
    let prevAnsweredAssignment;


    try {
        prevAnsweredAssignment = await getSpecificAssignmentsDetail( //if subject -> fetch from power data
                school_id, 
                class_id, 
                group_id,
                36,
                subject
            );
    }
    catch(error) {
        console.log('no images yet');
        console.log(error)  
    }

    console.log('prevAnsweredAssignment', prevAnsweredAssignment)
    const answerQ5 = prevAnsweredAssignment.answers_open_questions[prevAnsweredAssignment.answers_open_questions.length - 1].answer;
    const tol = 0.05;

    console.log('prevAnswer', answerQ5)
    const lowerBound = answerQ5 * (1 - tol) * 1.5;
    const upperBound = answerQ5 * (1 + tol) * 1.5;

    const isWithinTolerance = answer  >= lowerBound && answer <= upperBound;

    console.log('is within tolerance:', isWithinTolerance)
    console.log('answer:', answer)
    return isWithinTolerance;


}



export async function generateAnswerCarQ4(answer, chartNumber, school_id, class_id, group_id, title, assignment_number, subject){
    let prevAnsweredAssignment;
    let specificAssignmentMeasurements
    try {
        prevAnsweredAssignment = await getSpecificAssignmentsDetail( //if subject -> fetch from power data
                school_id, 
                class_id, 
                group_id,
                44,
                subject
            );
    }
    catch(error) {
        console.log('no images yet');
        console.log(error)  
    }

    try{
        specificAssignmentMeasurements = await getSpecificPowerMeasurementResult( //if subject -> fetch from power data
            school_id, 
            class_id, 
            group_id,
            title,
            assignment_number,
            subject
        );
    }
    catch(error){
        console.log('no images yet');
        console.log(error)
    }

    //add a check if chart data is empty or not
    if (!specificAssignmentMeasurements){
        Alert.alert('Doe eerst een meting voordat je de opdracht kan beantwoorden')
        return -1;
    }
    if ((!specificAssignmentMeasurements && chartNumber > specificAssignmentMeasurements.length + 1)) {
        Alert.alert('Deze grafiek bestaat niet')
        return -1;
    }
    console.log('chart data', specificAssignmentMeasurements[chartNumber - 1])
    const specific_data = specificAssignmentMeasurements[chartNumber - 1].velocity[0];
    const max_vel = Math.max(...specific_data);

    console.log('prevAnsweredAssignment', prevAnsweredAssignment) //Friction Force
    const answerQ3 = prevAnsweredAssignment.answers_open_questions[prevAnsweredAssignment.answers_open_questions.length - 1].answer;
    const tol = 0.05;

    console.log('prevAnswer', answerQ3)
    const lowerBound = answerQ3 * (1 - tol) * max_vel;
    const upperBound = answerQ3 * (1 + tol) * max_vel;

    const isWithinTolerance = answer  >= lowerBound && answer <= upperBound;

    console.log('is within tolerance:', isWithinTolerance)
    console.log('answer:', answer)
    return isWithinTolerance;


}