import axios from 'axios'

const url = `http://10.7.191.114:3000/api/v1/chatgpt`; //Passessese
// const url = `http://172.20.10.2:3000/api/v1/chatgpt`; //Iphone


// In the response of the post request, the answer of chatgpt is stored in the data field
// Therefore, no get request is needed
export async function postMessage(user_id, inputValue, thread_id) {
    console.log(`posting message?`)
    try{
        const response = await axios.post(url, {
            user_id: user_id,
            message: inputValue,
            thread_id: thread_id
        });
        const answer = JSON.stringify(response.data)
        const json = JSON.parse(answer.substring(answer.indexOf('{')));
        const message = json.message
                            .replace(/\"/g, '"') // remove \ before quotes
                            .replace(/\n/g, ''); // remove \n characters
        return message;
    }
    catch (error){
        console.log(error);
    }
}

export async function postDescriptionMessage(inputValue) {
    console.log(`posting description?`)
    try{
        const response = await axios.post(url + '/description', {
            message: inputValue,
        });
        const answer = JSON.stringify(response.data)
        const json = JSON.parse(answer.substring(answer.indexOf('{')));
        const message = json.message
                            .replace(/\"/g, '"') // remove \ before quotes
                            .replace(/\n/g, ''); // remove \n characters
        return message;
    }
    catch (error){
        console.log(error);
    }
}

export async function getChatHistory(user_id) {
    console.log(`get message?`)
    try{
        const response = await axios.get(url + `/${user_id}`);
        const chatHistories = JSON.stringify(response.data);
        return chatHistories;
    }
    catch (error){
        console.log(error);
    }
}


export async function deleteMessage(thread_id, user_id) {
    try {
        const response = await axios.delete(url + `/${user_id}/${thread_id}`);
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}