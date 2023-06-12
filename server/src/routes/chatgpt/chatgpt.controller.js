//TODO make post and delete request to endpoint

require('dotenv').config();


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
const apiKey = process.env.API_KEY_CHATGPT; 

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
        const lengthChat = chatHistoryRows.length
        if (lengthChat > 3) {
            chatHistoryRows = chatHistoryRows.slice(-3);
        }
        const context = chatHistoryRows.map((row) => row.question + '\n' + row.answer).join('\n');
        const fullContext = context + '\n' + message;

        console.log('fulltext', fullContext)
        
        let GPT35TurboMessage;
        if (thread_id <= 5) {
            const messageAnswer = 'Beantwoord in het nederlands de volgende vraag in maximaal 10 zinnen: ' + fullContext
            GPT35TurboMessage = [
                {
                    role: "system",
                    content: "Assistant doesn't directly answers the question, but tries to help a student understand their problem. The assistant is a really good mathematics, physics and programming teacher and is designed to help the student understand their question, without giving them a direct answer."
                },
                {
                    role: "user",
                    content: messageAnswer
                }
            ]
        } 
        if (thread_id === 6) {
            const studentAnswer = message
            let userPrompt
            console.log('fullContext', lengthChat)
                        
            userPrompt = `Please respond in dutch to the student's response. Your answer should be in dutch and only contain either 'Correct' or 'Incorrect'.  Students response: 
            ${studentAnswer}. `;
        
            const assistantPrompt = `
            The student is tasked to provide a complete answer about the characteristics of distance and displacement. 
            Specifically, they need to state that distance can only be positive and that displacement can be either positive or negative. 
            The correct answer must contain these points.
            Your answer should be in dutch and only contain either 'Correct' or 'Incorrect'.
            `;
            

            
            let systemPrompt = `
            You are a capable Dutch assistant in mathematics, physics, and programming. Your task is to evaluate the student's answer based on the following criteria. 
            The student should have an answer that resembles gives correct insights of displacement and distance. In this context the student should give an answer about if displacement and distance can be negative and / or positive.
            If both of these points are correctly present in the student's answer, respond with 'Correct'. If either or both are missing, respond with 'Incorrect'. If the answer contains incorrect information, respond with 'Incorrect'. 
            You are strictly required to respond with one word only, in Dutch: 'Correct' or 'Incorrect'.
            `;

            GPT35TurboMessage = [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userPrompt
                },
                {
                    role: "assistant",
                    content: assistantPrompt
                }
            ];
        
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