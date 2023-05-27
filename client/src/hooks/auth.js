import axios from 'axios';
import { ipAddressComputer } from '../data/ipaddresses.data';
import io from 'socket.io-client';
import { useCallback, useEffect, useState } from 'react';
import { useSocketUser } from '../store/userprofile-socket-context';

const url = ipAddressComputer + '/api/v1/'; //Passessese


export async function createUser({email, password, username, name, lastname, dob, school_name, school_id, user_role}) {
    const response = await axios.post(url + 'users', {
            email: email,
            password: password,
            username: username,
            name: name,
            lastname: lastname, 
            dob: dob,
            school_name: school_name,
            school_id: school_id,
            user_role: user_role, //TODO add tokens
            returnSecureToken: true,
        });
    
    return response.data
}

export async function login(email, password) {
    try{
        const response = await axios.post(url + 'auth/signin', {
            email: email,
            password: password,
            returnSecureToken: true,
        });
    
        return response.data;
    }
    catch (error) {
        console.log('error while logging in', error)
        throw error;
    }
}

export async function loginAdmin(email, password) {
    try {
        const response = await axios.post(url + 'auth/signin/admin', {
            email: email,
            password: password,
            returnSecureToken: true,
        });

        return response.data;
    }
    catch (error) {
        console.log('error while loggin in admin', error)
        throw error;
    }
}

export async function getUserProfileDetails(id) {
    try{
        const response =  await axios.get(url + `users/${id}`);
        return response.data
    }
    catch(error){
        console.log('error while gettting userprofile details', error)
        throw error;
    }
}


export async function getAdminProfileDetails(id) {
    try{
        const response =  await axios.get(url + `users/admin/${id}`);
        return response.data
    }
    catch(error){
        console.log('error while getting admin profile details', error)
        throw error;
    }
}


export async function deleteUserProfile(id) {
    try {
        return await axios.delete(url + `users/${id}`)
    }
    catch (error) {
        console.log('error while deleting user profile', error)
        throw error
    }
}

export async function changeUserProfile(userProfile) {
    try {
        const response =  await axios.put(url + `users/${userProfile.id}`, userProfile)
        return response.data
    }
    catch (error){
        console.log('error while making changes to user profile', error)
        throw error
    }
}

export async function updateGroupIDForUsers(group_id) {
    try {
        const response =  await axios.put(url + `users/group/${group_id}`)
        return response.data
    }
    catch (error){
        console.log('error while updating group id for users', error)
        throw error
    }
}


export async function updateGroupIDForClass(class_id) {
    try {
        const response =  await axios.put(url + `users/class/${class_id}`)
        return response.data
    }
    catch (error){
        console.log('error while updating group id for class', error)
        throw error
    }
}


export function useUserSocket(shouldConnect, group_ids) {
    const [dataUser, setDataUser] = useState([]);
    const socket = useSocketUser();

    const initializeUser = useCallback(() => {
        if (group_ids.length === 0) {
            return;
        }
        if (socket) {
            socket.emit('initialize', {
                group_ids
            });
            console.log('Connected to socket');
        }
    }, [group_ids, socket]);

    useEffect(() => {
        if (!shouldConnect || !socket) {
            return;
        }

        if (group_ids.length === 0) {
            return;
        }
        socket.on('connect', initializeUser);

        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
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

        socket.on('fetch-data-update', (updatedData) => {
            console.log('UPDATED DATA', updatedData)
            setDataUser(updatedData);
        });

        return () => {
            // Do not disconnect the socket here, as it is managed by the context
            console.log('Socket cleanup');
        };
    }, [shouldConnect, initializeUser, socket]);

    return [dataUser, initializeUser];
}
