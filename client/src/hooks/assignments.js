import axios from 'axios'

const url = `http://10.7.191.114:3000/api/v1/assignments`; //Passessese
// const url = `http://172.20.10.2:3000/api/v1/assignments`; //Iphone

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

