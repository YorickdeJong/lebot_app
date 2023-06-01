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
        Alert.alert('Error', 'het is niet gelukt om je antwoord in te voeren')
    }
    
    const begin = 3
    const end = 5
    function sumOfFirstSubArray(data) {
        if (data.length === 0 || !Array.isArray(data)) {
            throw new Error('First item of the data must be an array');
        }
      
        let firstSubArray = data;
        let sum = 0;
    
        for (let i = begin; i < firstSubArray.length - end; i++) {
            if (typeof firstSubArray[i].value === 'number') {
                sum += firstSubArray[i].value;
            } else {
                throw new Error('Value property must be a number');
            }
        }
    
        return sum;
    }


    const specific_data = specificAssignmentMeasurements[chartNumber - 1].velocity_time[0];
    const sum = sumOfFirstSubArray(specific_data)//specific_data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const mean = sum / ( specific_data.length - begin - end); // replace 0.7 with measurement frequency

    console.log('Mean:', mean);

    const tolerance = 0.15;
    const lowerBound = answer * (1 - tolerance);
    const upperBound = answer * (1 + tolerance);

    //check if answer is positive or negative
    let isWithinTolerance;
    if (mean < 0) {
        isWithinTolerance = mean <= lowerBound && mean >= upperBound;
    }
    else {
        isWithinTolerance = mean  >= lowerBound && mean <= upperBound;
    }


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

    const filteredData =  prevAnsweredAssignment.answers_open_questions.filter(answer => answer !== null)
    const answerQ2 = filteredData[filteredData.length - 1].answer;
    console.log('filtereddata', filteredData)
    console.log('prevAnswer', answerQ2)
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
    let specificAssignmentMeasurements;


    try {
        specificAssignmentMeasurements = await getSpecificMeasurementResult( //if subject -> fetch from power data
            school_id, 
            class_id, 
            group_id,
            title,
            assignment_number,
            subject
        );
    }
    catch(error) {
        console.log('no images yet');
        console.log(error)  
        Alert.alert('Er is iets mis gegaan met het beantwoorden van de vraag')
        return 
    }

    function sumOfAcceleration(data, begin, end) {
        if (data.length === 0 || !Array.isArray(data)) {
            throw new Error('First item of the data must be an array');
        }
      
        let firstSubArray = data;
        let sum = 0;
        let acceleration;
        let velocityDifference;
        let timeDifference;

        for (let i = begin; i < firstSubArray.length - end; i++) {
            if (typeof firstSubArray[i].value === 'number') {
                velocityDifference = firstSubArray[i + 1].value - firstSubArray[i].value;
                timeDifference = firstSubArray[i + 1].time - firstSubArray[i].time;
                acceleration =  velocityDifference / timeDifference
                sum += acceleration;
            } 
            else {
                throw new Error('Value property must be a number');
            }
        }
        return sum;
    }


    const begin = 1;
    const end = 5
    const specific_data = specificAssignmentMeasurements[chartNumber - 1].velocity_time[0];
    const sum = sumOfAcceleration(specific_data, begin, end)//specific_data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const mean = sum / ( specific_data.length - begin - end ); // replace 0.7 with measurement frequency

    console.log('mean', mean)
    const tolerance = 0.15;
    const lowerBound = answer * (1 - tolerance);
    const upperBound = answer * (1 + tolerance);

    let isWithinTolerance;
    if (mean < 0) {
        isWithinTolerance = mean <= lowerBound && mean >= upperBound;
    }
    else {
        isWithinTolerance = mean  >= lowerBound && mean <= upperBound;
    }

    console.log('is within tolerance:', isWithinTolerance)
    console.log('answer:', answer)
    return isWithinTolerance;
}




export async function generateAnswerMotorQ6(answer, chartNumber, school_id, class_id, group_id, title, assignment_number, subject){
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
            console.log('faioed to get previous assignment answer', error)  
            Alert.alert('Er is iets mis gegaan met het beantwoorden van de vraag')
            return 
        }

        console.log('prev answer', prevAnsweredAssignment)
        //add a check if chart data is empty or not
        if (!prevAnsweredAssignment){
            Alert.alert('Beantwoord eerst vraag 5!')
            return false;
        }

        console.log('length',  prevAnsweredAssignment.answers_open_questions.length - 1)
        const weight = 0.25
        const answerQ6 = prevAnsweredAssignment.answers_open_questions[prevAnsweredAssignment.answers_open_questions.length - 1].answer * weight;
        console.log('answerQ6', answerQ6)
        
        const tol = 0.02;
        console.log('prevAnswer', answerQ6)
        const lowerBound = answerQ6 * (1 - tol);
        const upperBound = answerQ6 * (1 + tol);

        let isWithinTolerance
        if (answerQ6 < 0) {
            isWithinTolerance = answer <= lowerBound && answer >= upperBound;
        } 
        else {
            isWithinTolerance = answer >= lowerBound && answer <= upperBound;
        }


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
        Alert.alert('Er is iets mis gegaan met het beantwoorden van de vraag')
        return 
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

    const isWithinTolerance = mean  >= lowerBound && mean <= upperBound;

    console.log('is within tolerance:', isWithinTolerance)
    console.log('answer:', answer)
    return isWithinTolerance;


}