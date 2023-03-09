import axios from 'axios'
import { useState } from 'react';
import io from 'socket.io-client';

//const url = `http://10.7.191.114:3000/api/v1/images`; //passesessese
const url = `http://172.20.10.2:3000/api/v1/images`; //Iphone

export async function getAllImages(user_id) {
    console.log(`user id: ${user_id}`)
    try{
        const response = await axios.get(url + `/all?user_profile_id=${user_id}`);
        console.log(response.data)
        return response.data;
    }
    catch (error){
        console.log(error);
    }

}

export function useImages(user_profile_id, assignment_number, title, isMounted, setEncodedImages) {
    const fetchImages = () => {
        const socket = io('http://172.20.10.2:3000');
        socket.on('connect', () => {
            console.log('connected')
            socket.emit('getImages', {user_profile_id, assignment_number, title})
        })
        socket.on('images', (data) => {
            console.log(data)
            setEncodedImages(data);
        })
        return () => { //Disconnects socket, this should be called when user leaves the screen
            if (isMounted){
                socket.off('images');
                socket.disconnect();
            }
        };
    };

    return fetchImages;
}



export async function deleteImages(image_id) {
    try {
        return await axios.delete(url + `/${image_id}`)
    }
    catch (error){
        console.log(error)
    }
}


// The create image needs to be used in the robot
export async function createImages({image_name, image_data, mime_type, assignment_number, user_profile_id}) {
    try {
        const response = await axios.post(url, {
            image_name: image_name, 
            image_data: image_data, 
            mime_type: mime_type, 
            assignment_number: assignment_number, 
            user_profile_id: user_profile_id
        })

        return response.data
    }
    catch (error){
        console.log(error)
    }
}

// export async function updateImages() {
    
// }

