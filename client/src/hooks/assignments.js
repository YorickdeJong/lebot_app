import axios from 'axios'
import { ipAddressComputer } from '../data/ipaddresses.data';

const url = ipAddressComputer + '/api/v1/assignments'; //Passessese

export async function getAssignments(title, assignment_number) {
    try{
        const response = await axios.get(url + `/specific?assignment_number=${assignment_number}&subject=${title}`);
        return response.data;
    }
    catch (error){
        console.log('error while getting specific assignment', error);
    }

}

export async function getAllAssignments(){
    try {
        const response = await axios.get(url + `/all`);
        return response.data
    }
    catch (error){
        console.log('error while getting all assignments', error)
    }
}

