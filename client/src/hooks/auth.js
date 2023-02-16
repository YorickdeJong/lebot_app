import axios from 'axios';

const url = `http://10.7.191.114:3000/api/v1/`;



export async function createUser({email, password, username, name, lastName, DOB, school, classSchool, level}) {
    const response = await axios.post(url + 'users', {
            email: email,
            password: password,
            username: username,
            name: name,
            lastname: lastName, 
            dob: DOB,
            school: school,
            classschool: classSchool,
            level: level,
            returnSecureToken: true,
        });

    return response.data
}

export async function login(email, password) {
    const response = await axios.post(url + 'auth/signin', {
        email: email,
        password: password,
        returnSecureToken: true,
    });

  return response.data;
}

export async function getUserProfileDetails(id) {
    try{
        const response =  await axios.get(url + `users/${id}`);
        console.log(response.data)
        return response.data
    }
    catch(error){
        console.log(error)
        throw error;
    }
}

export async function deleteUserProfile(id) {
    try {
        return await axios.delete(url + `users/${id}`)
    }
    catch (error) {
        throw error
    }
}

export async function changeUserProfile(userProfile) {
    console.log(userProfile)
    console.log(userProfile.id)
    try {
        const response =  await axios.put(url + `users/${userProfile.id}`, userProfile)
        return response.data
    }
    catch (error){
        throw error
    }
}