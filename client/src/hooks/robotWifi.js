
import axios from 'axios'
import { ipAddressComputer } from '../data/ipaddresses.data';
import { useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const url = ipAddressComputer + '/api/v1/robot-wifi'



export async function getRobotWifi(school_id, class_id, group_id) { // add to login
    try{
        const response = await axios.get(url + `/school`, {
            params: {
                school_id, 
                class_id,
                group_id   
            }
        });
        return response.data;
    }
    catch (error){
        console.log('error while getting robot wifi', error);
    }

}


export async function deleteRobotWifi(group_id) {
    try {
        const response = await axios.delete(url + `/${group_id}`);
        return response.data[0];
    } 
    catch (error) {
        console.log('error while deleting robot wifi', error);
        throw error
    }
}