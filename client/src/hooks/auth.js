import axios from 'axios';
import { ipAddressComputer } from '../data/ipaddresses.data';

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
    console.log('email', email, 'password', password, 'url', url + 'auth/signin')
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
        console.log('updated group id for users')
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
