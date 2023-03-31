import axios from 'axios'

const url = `http://10.7.191.114:3000/api/v1/assignmentDetails`; //PassesseselXT
//const url = //`http://172.20.10.2:3000/api/v1/assignmentDetails`; //Iphone

export async function getAllAssignmentDetails(user_id) {
    console.log(`userID: ${user_id}`)
    try{
        const response = await axios.get(url + `/all?user_id=${user_id}`);
        console.log(`data from assignmnetdetailsrepsose: ${response.data}`)
        return response.data;
    }
    catch (error){
        console.log(error);
    }

}

export async function getSpecificAssignmentsDetail(user_id, assignment_id) {
    try{
        const response = await axios.get(url + `/specific?user_id=${user_id}&assignment_id=${assignment_id}`);
        console.log(response.data)
        return response.data;
    }
    catch (error){
        console.log(error);
    }

}

export async function createAssignmentsDetail({user_id, assignment_id}) {
    console.log(user_id + " " + assignment_id)
    try {
        const response = await axios.post(url, {
            user_id: user_id,
            assignment_id: assignment_id
        })

        return response.data;
    }
    catch (error){
        console.log(error)
    }
}



// Maybe add these functinalities later on

// export async function updateAssignments() {
    
// }

// export async function deleteAssignments() {
    
// }
