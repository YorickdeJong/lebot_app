import axios from 'axios'

const url = `http://192.168.1.27:3000/api/v1/images`;

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

export async function getImages(user_id, assignment_number) {
    try{
        const response = await axios.get(url + `/?assignment_number=${assignment_number}&user_profile_id=${user_id}`);
        console.log(response.data)
        return response.data;
    }
    catch (error){
        console.log(error);
    }

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

