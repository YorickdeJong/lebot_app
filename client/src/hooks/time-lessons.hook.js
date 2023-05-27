import axios from 'axios';
import { ipAddressComputer } from '../data/ipaddresses.data';
import { useState, useContext, useEffect, useCallback } from 'react';
import { TimeContext, useSocketTimeLessons } from '../store/time-context';

const url = ipAddressComputer + '/api/v1/time-lessons';


export const useFetchTimeLessonsDataSocket = (shouldConnect, school_id) => {
    const [data, setData] = useState([]);
    const { socket } = useSocketTimeLessons();
    const timeCtx = useContext(TimeContext);

    const initialize = useCallback(() => {
        if (socket) {
            socket.emit('initialize', {school_id });
        }
        console.log('Initialize called for time lessons');
    }, [school_id, socket]);

    useEffect(() => {
            if (!shouldConnect || !socket) {
                return;
            }

            socket.on('connect', initialize);

            socket.on('connect_error', (error) => {
                console.log('Connection error time lessons:', error);
            });

            socket.on('disconnect', (reason) => {
                console.log('Disconnected:', reason);
                if (reason === 'io server disconnect') {
                    socket.connect();
                }
            });

            socket.on('reconnect', (attemptNumber) => {
                console.log('Reconnected after', attemptNumber, 'attempts');
            });

            socket.on('reconnect_failed', () => {
                console.error('Reconnection failed');
            });

            socket.on('time-lessons-update', (fetchedData) => {
                if (fetchedData.status === 400 || fetchedData.status === 500) {
                    console.log('time lessons empty or failed to fetch');
                    timeCtx.clearTimeDataHandler();
                    return;
                }
                timeCtx.setTimeDataHandler(fetchedData);
                setData(fetchedData);
            });

            return () => {
                // Do not disconnect the socket here, as it is managed by the context
                console.log('Socket cleanup');
            };
    }, [shouldConnect, initialize, socket]);

    return [data, initialize];
};


export async function getAllTimeLessonsForClass(school_id, class_id) {
    try {
        const response = await axios.get(`${url}?${school_id}&${class_id}`);
        return response.data;
    } 
    catch (error) {
        console.log('error while fetching all time lessons for class', error);
        throw error;
    }
}

export async function createTimeLesson(class_id, duration, school_id, active, lesson) {
    try {
        const response = await axios.post(url, {
            class_id,
            duration,
            school_id,
            active,
            lesson,
        });
        return response.data;
    } 
    catch (error) {
        console.log('error while creating time lesson', error);
        throw error;
    }
}

export async function updateTimeLesson(time_lesson_id, class_id, duration, school_id, active, lesson) {
    try {
        const response = await axios.put(`${url}/${time_lesson_id}`, {
            class_id,
            duration,
            school_id,
            active,
            lesson,
        });
        return response.data;
    } 
    catch (error) {
        console.log('error while updating time lesson', error);
        throw error;
    }
}

export async function deleteTimeLesson(time_lesson_id) {
    try {
        const response = await axios.delete(`${url}/${time_lesson_id}`);
        return response.data;
    } 
    catch (error) {
        console.log('error while deleting time lesson', error);
        throw error;
    }
}

export async function deleteAllLessonsForClass(class_id) {
    try {
        const response = await axios.delete(`${url}/class/${class_id}`);
        return response.data;
    } 
    catch (error) {
        console.log('error while deleting all time lessons for class', error);
        throw error;
    }
}

