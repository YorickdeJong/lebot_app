

import axios from 'axios'
import { ipAddressComputer } from '../data/ipaddresses.data';

const url = ipAddressComputer + '/api/v1/schools'; //Passessese

export async function getSpecificSchools(school_name) { // add to login
    try{
        const response = await axios.get(url + `?school_name=${school_name}`);
        return response.data;
    }
    catch (error){
        console.log('error while getting specific school', error);
    }

}

export async function getAllSchools(){
    try {
        const response = await axios.get(url + '/all');
        return response.data
    }
    catch (error){
        console.log('error while getting all schools', error)
    }
}

export async function createSchool(school_name) { //add to create account
    try {
        const response = await axios.post(url, {school_name: school_name} )
        return response.data[0]
    }   
    catch(error) {
        console.log('error while creating school', error)
    }
} 

export async function updateSchool(school_name) { // add to create context
    try {
        const response = await axios.put(url + `/${school_id}`, school_name);
        return response.data
    }
    catch (error){
        console.log('error while updating school', error)
    } 
}

export async function deleteSchool(school_name) { //change this to delete specific image
    try {
        const response = await axios.delete(url + `/name/${school_name}`)
        return response.data[0]
    }
    catch (error){
        console.log('error while deleting school', error)
    }
}

