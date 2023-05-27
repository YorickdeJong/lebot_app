import axios from 'axios'
import { ipAddressComputer } from '../data/ipaddresses.data';

const url = ipAddressComputer + '/api/v1/carProperties'; //Passessese

export async function getUserCarDetails(user_id) { // add to login
   try{
        const response = await axios.get(url + `/${user_id}`);
        return response.data;
    }
    catch (error){
        console.log('error while getting specific user car details', error)
    }

}

export async function getAllCarDetails(){
    try {
        const response = await axios.get(url);
        return response.data
    }
    catch (error){
        console.log('error while getting all car details', error)
    }
}

export async function createUserCarDetails(user_id) { //add to create account
    try {
        const response = await axios.post(url, {
            user_profile_id: user_id
        })
        return response.data
    }   
    catch(error) {  
        console.log('error while creating user car details', error)
    }
} 

export async function changeUserCarDetails(carDetails) { // add to create context
    try {
        const response = await axios.put(url + `/${carDetails.user_profile_id}`, carDetails);
        return response.data
    }
    catch (error){
        console.log('error while changing user car details', error)
    } 
}