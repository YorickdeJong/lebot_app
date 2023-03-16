//TODO make post and delete request to endpoint

const axios = require('axios');
const {Configuration, OpenAIApi} = require('openai');
const { 
    postChatgptQuery, 
    getAllChatHistoryQuery,
    getCurrentChatHistoryQuery,
    deleteChatHistoryQuery 
} = require('../../services/queries/queryChatgpt');

const pool = require('../../services/postGreSQL');
const apiKey = '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';

const getChatHistory = async (req, res) => {
    const client = await pool.connect();

    try{
        const {user_id} = req.params;
        const response = await client.query(getAllChatHistoryQuery, [user_id]);
        return res.status(200).json(response.rows);
    }

    catch (error){
        console.log(error)
        return res.status(500).json({error: 'Failed to get chatgpt'});
    }

    finally{
        client.release();
    }
}


const postChatgpt = async (req, res) => {
    const client = await pool.connect();
    const openai = new OpenAIApi(apiKey);

    try{
        const {user_id, message, thread_id} = req.body;

        const chatHistoryResult = await client.query(getCurrentChatHistoryQuery, [user_id, thread_id]);
        const context = chatHistoryResult.rows.map((row) => row.question + '\n' + row.answer).join('\n');
        const fullContext = context + '\n' + message;
        console.log(fullContext)


        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: fullContext,
            temperature: 0.5, //higher value, more risks
            max_tokens: 600,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0.5,
        }, {
            headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
            }
        });

        const botMessage = response.data.choices[0].text;
        console.log(botMessage)
        const values = [user_id, message, botMessage, thread_id];
        await client.query(postChatgptQuery, values); //Updae the database with the new chat history
        return res.status(200).json({message: botMessage}) // want to send bot message + all the chat histtory here? 
    }

    catch (error){
        console.log(error)
        return res.status(500).json({error: 'Failed to post chatgpt'});
    }

    finally{
        client.release();
    }
}

const postDescriptionOfChat = async (req, res) => {
    const client = await pool.connect();
    const openai = new OpenAIApi(apiKey);

    try{
        const {message} = req.body;
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: message,
            temperature: 0.5, //higher value, more risks
            max_tokens: 600,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0.5,
        }, 
        {
            headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
            }
        });

        const botMessage = response.data.choices[0].text;
        return res.status(200).json({message: botMessage}) // want to send bot message + all the chat histtory here? 
    }

    catch (error){
        console.log(error)
        return res.status(500).json({error: 'Failed to post chatgpt'});
    }

    finally{
        client.release();
    }
}


const deleteChatgpt = async (req, res) => {
    const client = await pool.connect();

    try{
        const { thread_id, user_id } = req.params;
        await client.query(deleteChatHistoryQuery, [thread_id, user_id]);
        console.log(`Deleted chat history with thread_id ${thread_id} for user ${user_id}.`)
        return res.status(200).json({message: `Chat history with thread_id ${thread_id} deleted for user ${user_id}.`})
    }

    catch (error){
        console.log(error)
        return res.status(500).json({error: 'Failed to delete chatgpt'});
    }

    finally{
        client.release();
    }
}

module.exports = {
    postChatgpt,
    deleteChatgpt,
    getChatHistory,
    postDescriptionOfChat
}