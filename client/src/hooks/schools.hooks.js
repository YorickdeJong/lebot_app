

import axios from 'axios'
import { ipAddressComputer } from '../data/ipaddresses.data';

const url = ipAddressComputer + '/api/v1/schools'; //Passessese

export async function getSpecificSchools(school_name) { // add to login
    console.log(user_id)
    try{
        const response = await axios.get(url + `?school_name=${school_name}`);
        console.log(`response data: ${JSON.stringify(response.data)}`)
        return response.data;
    }
    catch (error){
        console.log(error);
    }

}

export async function getAllSchools(){
    try {
        const response = await axios.get(url + '/all');
        return response.data
    }
    catch (error){
        console.log(error)
    }
}

export async function createSchool(school_name) { //add to create account
    try {
        console.log('school_name' , school_name)
        const response = await axios.post(url, {school_name: school_name} )
        console.log(response.date)
        return response.data[0]
    }   
    catch(error) {
        console.log(error)
    }
} 

export async function updateSchool(school_name) { // add to create context
    console.log(school_name)
    try {
        const response = await axios.put(url + `/${school_id}`, school_name);
        return response.data
    }
    catch (error){
        console.log(error)
    } 
}

export async function deleteSchool(school_name) { //change this to delete specific image
    try {
        const response = await axios.delete(url + `/name/${school_name}`)
        return response.data[0]
    }
    catch (error){
        console.log(error)
    }
}

