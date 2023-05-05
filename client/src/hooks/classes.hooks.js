import axios from 'axios';

import { ipAddressComputer } from '../data/ipaddresses.data';
const url = ipAddressComputer + '/api/v1/classes';

export async function getClassesPerSchool(school_id) {
    console.log('school_id', school_id)
    try {
        const response = await axios.get(url + `/school?school_id=${school_id}`);
        return response.data;
    } 
    catch (error) {
        console.log(error);
        throw error;
    }
}

export async function createClass({ name, school_id, max_count }) {
    try {
        const response = await axios.post(url, { name,  school_id, max_count });
        return response.data[0];
    } 
    catch (error) {
        console.log(error);
        throw error;
    }
}

export async function updateClass({class_id, school_id, name, max_count }) {
    console.log(name)
    console.log(max_count)
    try {
        const response = await axios.put(url + `/${class_id}`, { name, max_count, school_id });
        return response.data[0];
    } 
    catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteClassByID(class_id) {
    try {
        const response = await axios.delete(url + `/${class_id}`);
        return response.data[0];
    } 
    catch (error) {
        console.log(error);
        throw error;
    }
}
