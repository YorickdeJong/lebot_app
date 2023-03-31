import axios from 'axios'

const url = `http://10.7.191.114:3000/api/v1/carProperties`; //Passessese
// const url = `http://172.20.10.2:3000/api/v1/carProperties`; //Iphone

export async function getUserCarDetails(user_id) { // add to login
    console.log(user_id)
    try{
        const response = await axios.get(url + `/${user_id}`);
        console.log(`User CAR DATA: ${JSON.stringify(response.data)}`)
        return response.data;
    }
    catch (error){
        console.log(error);
    }

}

export async function getAllCarDetails(){
    try {
        const response = await axios.get(url);
        return response.data
    }
    catch (error){
        console.log(error)
    }
}

export async function createUserCarDetails(user_id) { //add to create account
    try {
        const response = await axios.post(url, {
            user_profile_id: user_id
        })
        return response.data
    }   
    catch(error) {
        console.log(error)
    }
} 

export async function changeUserCarDetails(carDetails) { // add to create context
    console.log(carDetails)
    try {
        const response = await axios.put(url + `/${carDetails.user_profile_id}`, carDetails);
        return response.data
    }
    catch (error){
        console.log(error)
    } 
}