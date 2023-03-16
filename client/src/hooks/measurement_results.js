import axios from 'axios'
import { useState } from 'react';
import io from 'socket.io-client';

//const url = `http://10.7.191.114:3000/api/v1/images`; //passesessese
const url = `http://172.20.10.2:3000/api/v1/measurement-results/`; //Iphone

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
        const response = await axios.get(url + `latest/${user_profile_id}`);
        return response.data[0];
    }
    catch (error){
        console.log(error);
    }
}


export async function getSpecificMeasurementResult(user_profile_id, title, assignment_number) {
    try{
        const response = await axios.get(url + `?user_profile_id=${user_profile_id}&assignment_number=${title}&title=${assignment_number}}`);
        return response.data;
    }
    catch (error){
        console.log(error);
    }

}


export async function deleteImages(user_profile_id) { //change this to delete specific image
    try {
        return await axios.delete(url + `/${user_profile_id}`)
    }
    catch (error){
        console.log(error)
    }
}

