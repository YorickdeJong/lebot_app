import axios from 'axios'
import { ipAddressComputer } from '../data/ipaddresses.data';

const url = ipAddressComputer + '/api/v1/measurement-results'

export async function getAllMeasurementResults(user_profile_id) {
    try{
        const response = await axios.get(url + `/all/${user_profile_id}`);
        return response.data;
    }
    catch (error){
        console.log(error);
    }

}


export async function getLatestMeasurementResult(user_profile_id) {
    try{
        const response = await axios.get(url + `/latest/${user_profile_id}`);
        return response.data[0];
    }
    catch (error){
        console.log(error);
    }
}


export async function getSpecificMeasurementResult(user_profile_id, title, assignment_number, subject) {
    try{
        const response = await axios.get(url + `?user_profile_id=${user_profile_id}&assignment_number=${assignment_number}&title=${title}&subject=${subject}`);
        return response.data;
    }
    catch (error){
        console.log(error);
    }

}


export async function deleteMeasurementResult(recordNumber) { //change this to delete specific image
    try {
        return await axios.delete(url + `?record_number=${recordNumber}`)
    }
    catch (error){
        console.log(error)
    }
}

