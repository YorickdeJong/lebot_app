import { useState, useEffect } from 'react';
import axios from 'axios';
import { ipAddressComputer } from '../data/ipaddresses.data';

const API_BASE_URL = ipAddressComputer + '/api/v1/keys';

// Get specific key
export async function getSpecificKey(uuid_key) {
    try {
        const response = await axios.get(`${API_BASE_URL}?uuid_key=${uuid_key}`);
        return response.data[0];
    } 
    catch (error) {
        console.error('Error fetching specific key:', error);
        return false;
    }
}


// Get all keys for a school
export async function useGetAllKeysForSchool(school_name) {
    try {
        const response = await axios.get(`${API_BASE_URL}/all?school_name=${school_name}`);
        return response.data;
    } 
    catch (error) {
        console.error('Error fetching all keys for school:', error);
    } 
}
  
// Create key
export const createKeys = async (keys) => {
    let responseData = null;

    try {
        const response = await axios.post(`${API_BASE_URL}`, { keys });
        responseData = response.data;
    } 
    catch (error) {
        console.error('Error creating keys:', error);
    }
    return responseData;
};

// Delete all school keys

export const deleteAllSchoolKeys = async (school_name) => {
        let responseData = null;
    
        try {
            const response = await axios.delete(`${API_BASE_URL}/all/${school_name}`);
            responseData = response.data.keys;
            return responseData;
        } 
        catch (error) {
            console.error('Error deleting all school keys:', error);
            return responseData;
        }

};
  
  
  // Delete specific key
export const deleteSpecificKey = async (id) => {
    let responseData = null;

    try {
        const response = await axios.delete(`${API_BASE_URL}/${id}`);
        return true;
    } 
    catch (error) {
        console.error('Error deleting specific key:', error);
        return false;
    }
};
  