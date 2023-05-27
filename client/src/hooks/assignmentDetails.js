import axios from 'axios'
import { ipAddressComputer } from '../data/ipaddresses.data';

const url = ipAddressComputer + '/api/v1/assignmentDetails'

export async function getGroupAssignmentDetails(school_id, class_id, group_id) {
    try{
        const response = await axios.get(url + `/all`, {
            params: {
                school_id,
                class_id,
                group_id
            }
        });
        return response.data;
    }
    catch (error){
        console.log('Error while getting group assignment details', error);
    }
}

export async function getSpecificAssignmentsDetail(school_id, class_id, group_id, assignment_id, subject) {
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
        console.log('error while fetching specific assignment detail', error);
    }

}

export async function createAssignmentsDetail({school_id, class_id, group_id, assignment_id, subject, answers_multiple_choice, answers_open_questions}) {
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
        console.log('error while creating assignment details', error)
    }
}
