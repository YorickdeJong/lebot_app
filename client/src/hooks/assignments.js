import axios from 'axios'

const url = `http://192.168.1.27:3000/api/v1/assignments`;

export async function getAssignments(title, assignment_number) {
    try{
        const response = await axios.get(url + `/specific?assignment_number=${assignment_number}&subject=${title}`);
        return response.data;
    }
    catch (error){
        console.log(error);
    }

}

export async function getAllAssignments(){
    try {
        const response = await axios.get(url + `/all`);
        return response.data
    }
    catch (error){
        console.log(error)
    }
}

// Maybe add these functinalities later on
// export async function createAssignments() {
    
// }

// export async function updateAssignments() {
    
// }

// export async function deleteAssignments() {
    
// }
