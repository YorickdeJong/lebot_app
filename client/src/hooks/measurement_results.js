import axios from 'axios'
import { ipAddressComputer } from '../data/ipaddresses.data';
import { ChartContext } from '../store/chart-context';
import { SocketContext } from '../store/socket-context';
import io from 'socket.io-client';
import { useContext, useEffect, useRef, useState } from 'react';

const url = ipAddressComputer + '/api/v1/measurement-results'

export async function getAllMeasurementResults(user_profile_id) {
    console.log(user_profile_id)
    try{
        const response = await axios.get(url + `/all/${user_profile_id}`);
        return response.data;
    }
    catch (error){
        console.log('error while getting all measurement results', error);
    }

}


export const useSocketMeasurementResults = (shouldConnect, group_id) => {
    const chartCtx = useContext(ChartContext);
    const sshSocketCtx = useContext(SocketContext);
    const socket = useRef(null);

    useEffect(() => {
        //return if socket doesn't need to be called
        if (!shouldConnect) {
            return;
        }        
        
        if (!sshSocketCtx.power){
            chartCtx.emptyChartData();
        }
        if (sshSocketCtx.power) {
            sshSocketCtx.setIsMeasurementStarted(false);
            chartCtx.emptyChartData();
            // Emit the 'request-latest-data' event when a new measurement is started
        }
        const newSocket = io(url);

        //Client successfully connected to the server

        newSocket.on('connect', () => {
            newSocket.emit('group-movement-measurement', group_id);
            console.log('Connected to socket');
        });
    
        newSocket.on('connect_error', (error) => {
            console.error('Connection error live measurements:', error);
        });
    
        newSocket.on('disconnect', (reason) => {
            console.log('Disconnected:', reason);
            if (reason === 'io server disconnect') {
                // The disconnection was initiated by the server, you need to reconnect manually.
                newSocket.connect();
            }
            // Else, the socket will automatically try to reconnect.
        });
    
        newSocket.on('reconnect', (attemptNumber) => {
            console.log('Reconnected after', attemptNumber, 'attempts');
        });
    
        newSocket.on('reconnect_failed', () => {
            console.error('Reconnection failed');
        });
    
        newSocket.on('measurement-results-update', (data) => {
            chartCtx.setChartDataHandler(data[0]); //change this, maybe return some data? 
        });

        
        socket.current = newSocket;

        return () => {
            chartCtx.emptyChartData();
            newSocket.disconnect();
        }
    }, [sshSocketCtx.power]);

    return socket;
};



export async function getSpecificMeasurementResult(school_id, class_id, group_id, title, assignment_number, subject) {
    console.log('school_id', school_id, 'class_id', class_id, 'group_id', group_id, 'title', title, 'assignment_number', assignment_number, 'subject', subject)
    try{
        const response = await axios.get(url,  {
            params: {
                school_id,
                class_id,
                group_id,
                title, 
                assignment_number,
                subject
            }
        });
        return response.data;
    }
    catch (error){
        console.log('error while getting specific measurement result', error);
    }

}


export async function deleteMeasurementResult(recordNumber) { //change this to delete specific image
    try {
        return await axios.delete(url + `?record_number=${recordNumber}`)
    }
    catch (error){
        console.log('failed to delete', error)
    }
}

