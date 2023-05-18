
import axios from 'axios'
import { ipAddressComputer } from '../data/ipaddresses.data';
import { useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { ChartContext } from '../store/chart-context';
import { SocketContext } from '../store/socket-context';

const url = ipAddressComputer + '/api/v1/power-measurement-results'


export const useSocketPower = (shouldConnect, user_id) => {
    const chartCtx = useContext(ChartContext);
    const sshSocketCtx = useContext(SocketContext);
    const socket = useRef(null);
    const [dataCount, setDataCount] = useState(0);

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
            newSocket.emit('user-profile-id', user_id);
            console.log('Connected to socket');
        });
    
        newSocket.on('connect_error', (error) => {
            //console.error('Connection error:', error);
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
    
        newSocket.on('power-data-update', (data) => {
            chartCtx.setChartDataHandler(data.data[0]);
        });

        
        socket.current = newSocket;

        return () => {
            chartCtx.emptyChartData();
            newSocket.disconnect();
        }
    }, [sshSocketCtx.power]);

    return socket;
};


export async function getSpecificPowerMeasurementResult(school_id, class_id, group_id, title, assignment_number, subject) {
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
        console.log('fetched data Power', response.data)
        return response.data;
    }
    catch (error){
        console.log('Failed to fetch data from server')
        console.log(error);
    }

}

export async function deletePowerMeasurementResult(recordNumber) { //change this to delete specific image
    try {
        return await axios.delete(url + `?record_number=${recordNumber}`)
    }
    catch (error){
        console.log(error)
    }
}

