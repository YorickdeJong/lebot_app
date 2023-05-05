import axios from 'axios'
import { ipAddressComputer } from '../data/ipaddresses.data';

const url = ipAddressComputer + '/api/v1/assignmentDetails'

export async function getGroupAssignmentDetails(school_id, class_id, group_id) {
    console.log(`userID: ${user_id}`)
    try{
        const response = await axios.get(url + `/all`, {
            school_id,
            class_id,
            group_id
        });
        console.log(`data from assignmnetdetailsrepsose: ${response.data}`)
        return response.data;
    }
    catch (error){
        console.log(error);
    }

}

export async function getSpecificAssignmentsDetail(school_id, class_id, group_id, assignment_id, subject) {
    console.log('school_id', school_id, 'class_id', class_id, 'group_id', group_id, 'assignment_id', assignment_id, 'subject', subject)
    try{
        const response = await axios.get(url + `/specific`, {
            params: {
                school_id,
                class_id,
                group_id,
                assignment_id,
                subject,
              },
        });
        return response.data[0];
    }
    catch (error){
        console.log('error while fetching specific assignment detail')
        console.log(error);
    }

}

export async function createAssignmentsDetail({school_id, class_id, group_id, assignment_id, subject, answers_multiple_choice, answers_open_questions}) {
    console.log('Data being sent:', {
        school_id,
        class_id,
        group_id,
        assignment_id,
        subject,
        answers_multiple_choice: JSON.stringify(answers_multiple_choice),
        answers_open_questions: JSON.stringify(answers_open_questions)
    });
    try {
        const response = await axios.post(url, {
            school_id,
            class_id,
            group_id,
            assignment_id,        
            subject,
            answers_multiple_choice: JSON.stringify(answers_multiple_choice),
            answers_open_questions: JSON.stringify(answers_open_questions)
        })
        return response.data;
    }
    catch (error){
        console.log(error)
    }
}



// Maybe add these functinalities later on

// export async function updateAssignments() {
    
// }

// export async function deleteAssignments() {
    
// }
