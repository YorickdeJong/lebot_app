
import axios from 'axios'
import { ipAddressComputer } from '../data/ipaddresses.data';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useRef } from 'react';

const url = ipAddressComputer + 'power-data'


export const useSocketPower = () => {
    const [powerData, setPowerData] = useState(null);
    const [socket, setSocket] = useRef(null);

    useEffect(() => {
        const newSocket = io(ipAddressComputer);
        setSocket(newSocket);

        newSocket.on('power-data-update', (data) => {
        setPowerData(data);
        });

        return () => {
        newSocket.disconnect();
        };
    }, []);

    return { powerData, socket };
};


export async function getSpecificPowerMeasurementResult(user_profile_id, title, assignment_number, subject) {
    try{
        const response = await axios.get(url + `?user_profile_id=${user_profile_id}&assignment_number=${assignment_number}&title=${title}&subject=${subject}`);
        return response.data;
    }
    catch (error){
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

