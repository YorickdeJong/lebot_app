//TODO make post and delete request to endpoint

const axios = require('axios');
const {Configuration, OpenAIApi} = require('openai');

const { 
    postChatgptQuery, 
    getAllChatHistoryQuery,
    getCurrentChatHistoryQuery,
    deleteChatHistoryQuery,
    getDescriptionQuery,
    createDescriptionQuery,
    deleteDescriptionQuery
} = require('../../services/queries/queryChatgpt');

const pool = require('../../services/postGreSQL');
const { get } = require('http');
const apiKey = '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';

const getChatHistory = async (req, res) => {
    const client = await pool.connect();

    try{
        const {user_id} = req.params;
        const response = await client.query(getAllChatHistoryQuery, [user_id]);
        return res.status(200).json(response.rows);
    }

    catch (error){
        console.log('Failed to get chatgpt')
        return
        // return res.status(500).json({error: 'Failed to get chatgpt'});
    }

    finally{
        client.release();
    }
}


const postChatgpt = async (req, res) => {
    const client = await pool.connect();
    const openai = new OpenAIApi(
        new Configuration({ apiKey: apiKey })
      );

    try{
        const {user_id, message, thread_id} = req.body;

        const chatHistoryResult = await client.query(getCurrentChatHistoryQuery, [user_id, thread_id]);
        let chatHistoryRows = chatHistoryResult.rows;
        if (chatHistoryRows.length > 3) {
            chatHistoryRows = chatHistoryRows.slice(-3);
        }
        const context = chatHistoryRows.map((row) => row.question + '\n' + row.answer).join('\n');
        const fullContext = context + '\n' + message;
        console.log(fullContext);

        
        let GPT35TurboMessage;
        let messageGPT;
        if (thread_id <= 5) {
            messageGPT = 'respond with a question or a hint in dutch that makes the user think about their problem. If you think that the user gets it, respond with the actual answer. Here is the full conversation context: ' + "'" + fullContext + "'";
            GPT35TurboMessage = [
                {
                    role: "system",
                    content: "Assistant doesn't directly answers the question, but tries to help a student understand their problem. The assistant is a really good mathematics, physics and programming teacher and is designed to help the student understand their question, without giving them a direct answer."
                },
                {
                    role: "user",
                    content: messageGPT
                }
            ]
        } 
        if (thread_id === 6) {
            messageGPT = "check if the folllowing message contains the following information: De snelheid kan zowel positief als negatief zijn, de afstand kan alleen positief zijn en de verplaatsing kan zowel positief als negatief zijn. Comment if a statement is missing an keep your response very short."  + "'" + fullContext + "'";  //If the following message failed to answer all of these statements or provided a wrong statement, let the user know and begin your response with 'Onjuist', otherwise respond with 'Correct' for the following message: " + "'" + fullContext + "'";
            GPT35TurboMessage = [
                {
                    role: "system",
                    content: "Assistant is a really good mathematics, physics and programming teacher and is designed to answer mathetmatics and physics questions and give feedback on the answer."
                },
                {
                    role: "user",
                    content: message
                }
            ]
        }


        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: GPT35TurboMessage,
        });

        const botMessage = response.data.choices[0].message.content;
        console.log(botMessage)
        const values = [user_id, message, botMessage, thread_id];
        await client.query(postChatgptQuery, values); //Updae the database with the new chat history
        return res.status(200).json({message: botMessage}) // want to send bot message + all the chat histtory here? 
    }

    catch (error){
        console.log('error', error)
        console.log('Failed to post chatgpt')
        return
        // return res.status(500).json({error: 'Failed to post chatgpt'});
    }

    finally{
        client.release();
    }
}

const postDescriptionOfChat = async (req, res) => {
    const client = await pool.connect();
    const openai = new OpenAIApi(
        new Configuration({ apiKey: apiKey })
    );

    try{
        const {message, user_id, thread_id} = req.body;
        if (message === undefined || !message.length || message.length === 0){ 
            return;
        }

        const {rows} = await client.query(getDescriptionQuery, [user_id, thread_id]);

        // if empty, proceed, else skip chatgpt and return the desciption as is        
        if (rows.length === 0){
            const GPT35TurboMessageAnswer = [
                {
                    role: "system",
                    content: "Assistant is a really good mathematics, physics and programming teacher and is designed to answer mathetmatics and physics questions"
                },
                {
                    role: "user",
                    content: message
                }
            ]

            const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: GPT35TurboMessageAnswer,
            });


            const description = response.data.choices[0].message.content;
            //TODO: Post bot message to database
            const values = [user_id, description, thread_id];
            await client.query(createDescriptionQuery, values);
            return res.status(200).json({message: description}) // want to send bot message + all the chat histtory here? 
        }
        return res.status(200).json({message: rows[0]}) // if description is already set, return the description
    }

    catch (error){
        console.log('error', error)
        console.log(`Failed to post description chatGPT`)
        return 
        // return res.status(500).json({error: 'Failed to post chatgpt'});
    }

    finally{
        client.release();
    }
}


const deleteChatgpt = async (req, res) => {
    const client = await pool.connect();

    try{
        const { thread_id, user_id } = req.params;
        // TODO: add delete function here for database
        await client.query(deleteDescriptionQuery, [user_id, thread_id]);
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