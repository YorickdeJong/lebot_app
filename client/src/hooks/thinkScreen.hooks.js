import axios from 'axios';
import { ipAddressComputer } from '../data/ipaddresses.data';

const url = ipAddressComputer + '/api/v1/brainstorm-text';

export async function getBrainstormText(user_id, assignment_number, subject) {
    try{
        const response = await axios.get(url, {params: {user_id, assignment_number, subject}});
        console.log('response', response.data[0])
        return response.data[0];
    } catch (error){
        console.log('Error while getting brainstorm text', error);
        return false
    }
}

export async function createBrainstormText(user_id, assignment_number, subject, text_one, text_two, text_three, text_four) {
    
    try {
        const response = await axios.post(url, {user_id, assignment_number, subject, text_one, text_two, text_three, text_four});
        return response.data;
    } catch(error) {
        console.log('Error while creating brainstorm text', error);
    }
}

export async function updateBrainstormText(user_id, assignment_number, subject, text_one, text_two, text_three, text_four) {
    try {
        const response = await axios.put(url, {user_id, assignment_number, subject, text_one, text_two, text_three, text_four});
        return response.data;
    } catch (error){
        console.log('Error while updating brainstorm text', error);
    }
}

export async function deleteBrainstormText(user_id, assignment_number, subject) {
    try {
        const response = await axios.delete(url + `/${user_id}/${assignment_number}/${subject}`);
        return response.data;
    } catch (error){
        console.log('Error while deleting brainstorm text', error);
    }
} 