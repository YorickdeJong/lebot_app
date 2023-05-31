import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ASSIGNMENT_EXPLANATION } from "../data/InitialAssignmentExplanation";
import { deleteMessage, getChatHistory, postDescriptionMessage, postMessage } from "../hooks/chatgpt";
import { UserProfileContext } from "./userProfile-context";



export const ChatContext = createContext({
    chat: [],
    thread_ids: [],
    currentThreadId: null,
    descriptions: [],
    addThread_ID: (newThread_id) => {},
    setThreadId: (thread_id) => {},
    addChat: (chat) => {},
    deleteThread_ID: (thread_id) => {},
    initializeChatHistory: (chatHistory) => {},
    getChatForThread: (thread_id) => [],
    generateDescription: (thread_id) => {},
    getDescriptionsForThreadId: (thread_id) => {},
})


function ChatContextProvider({ children }) {
    const [chat, setChat] = useState([]);
    //TODO add second chat here that contains prewritten messages
    const [thread_ids, setThreadIds] = useState([]);
    const [currentThreadId, setCurrentThreadId] = useState(null);
    const [descriptions, setDescriptions] = useState([
    ]);
    const userprofileCtx = useContext(UserProfileContext);
    const user_id = userprofileCtx.userprofile.id;
    const [firstDescription, setFirstDescription] = useState(true)

    useEffect(() => { 
        loadChatFromStorage();
    }, [])
    
    // if chat changes, descriptions are loaded
    useEffect(() => {
        // Check if the currentThreadId is greater than 5 or the first question has been asked.
        if (currentThreadId > 5) {
            return;
        }

        // If firstQuestionAsked is false, generate the description
        generateDescriptions(currentThreadId)

    }, [chat]) // Add firstQuestionAsked to the dependency array


    // Load chat data from storage
    async function loadChatFromStorage() {
        try {
            const chatJSON = await AsyncStorage.getItem("chat");
            const thread_idsJSON = await AsyncStorage.getItem("thread_ids");
            const uniqueThreadIdsFiltered = JSON.parse(thread_idsJSON).filter((value, index, self) => {
                    return self.indexOf(value) === index;
            });
            const uniqueThreadIds = uniqueThreadIdsFiltered.filter(thread => thread !== null)
            const descriptionsJSON = await AsyncStorage.getItem("descriptions");

            if (chatJSON !== null) {
                setChat(JSON.parse(chatJSON));
            }

            if (uniqueThreadIds) {
                setThreadIds(uniqueThreadIds);
                setCurrentThreadId(uniqueThreadIds.length);
            }

            if (descriptionsJSON !== null) {
                const storedDescriptions = JSON.parse(descriptionsJSON);
                storedDescriptions.map(description => {
                    if (description.thread_id === undefined)
                    {
                        return;
                    }
                    return
                })
                setDescriptions(storedDescriptions);
            }
            console.log('LOADED DESCRIPTIONS FROM STORAGE')
        } 
        catch (error) {
            console.error("Error loading chat data from storage:", error);
        }
    }

    // Save chat data to storage
    async function saveChatInStorage(chatData) {
        try {
            const chatJSON = JSON.stringify(chatData);
            await AsyncStorage.setItem("chat", chatJSON);
            console.log('saved chat data in storage')
        }
        catch (error){
            console.error("Error saving chat data to storage:", error);
        }
    }

    // Set new thread_ids array in storage
    async function saveThreadsInStorage(newThreadIds) {
        try {
            const thread_idsJSON = JSON.stringify(newThreadIds);
            await AsyncStorage.setItem("thread_ids", thread_idsJSON);
            console.log('saved thread_ids data in storage')
        }
        catch (error){
            console.error("Error saving thread_ids data to storage:", error);
        }
    }

    async function saveDescriptionsInStorage(newDescriptions){
        try {
            const descriptionsJSON = JSON.stringify(newDescriptions);
            await AsyncStorage.setItem("descriptions", descriptionsJSON);
            console.log('saved descriptions data in storage')
        }
        catch (error){
            console.error("Error saving descriptions data to storage:", error);
        }
    }

    // Set new chat array in storage
    function initializeChatHistory(chatHistory) {
            setChat(chatHistory);
            saveChatInStorage(chatHistory);
    }

    function addThread_ID(newThread_id) {
        setThreadIds(prevThreadIds => {
            const newThreadIds = [...prevThreadIds, newThread_id];
            saveThreadsInStorage(newThreadIds);
            return newThreadIds;
        })
        
        setCurrentThreadId(newThread_id);
    }

    function setThreadId(thread_id){
        setCurrentThreadId(thread_id)
    }


    async function addChat(chatMessage) {
        setChat((prevChat) => {
            const newChatHistory = [...prevChat, chatMessage];
            saveChatInStorage(newChatHistory);
            return newChatHistory;
        });
    
        console.log('check')
        // If this is a question from the user, start the process to get an answer from the bot
        if (chatMessage.question) {
            console.log('chatMessage.thread_id', chatMessage.thread_id)
            await getBotAnswer(chatMessage);
        }
    }
    
    async function getBotAnswer(chatMessage) {
        //add chatMessage jere
        const response = await postMessage(userprofileCtx.userprofile.id, chatMessage.question, chatMessage.thread_id);
        console.log(response)
        if (response) {
            const botMessage = response; // Update this line if needed to extract the message from the response
            const chatAnswer = {
                answer: botMessage,
                thread_id: chatMessage.thread_id
            }
            addChat(chatAnswer);
        }
        else {
            // Handle the case where no response was received, if necessary
        }
    }
    async function deleteThread_ID(thread_id) {
        if (!chat || !Array.isArray(chat)) {
            setChat([]);
            await AsyncStorage.setItem('chat', '');
            await AsyncStorage.setItem('thread_ids', '');
        }
        //delete chat from database
        deleteMessage(thread_id, user_id);

        //delete chat from state
        
        setChat(prevChat => prevChat.filter(chat => chat.thread_id !== thread_id));
        const updatedThreadIds = thread_ids.filter(id => id !== thread_id);
        setThreadIds(updatedThreadIds);
        try {
            const updatedChat = await AsyncStorage.getItem('chat');
            if (updatedChat !== null) {
                const parsedChat = JSON.parse(updatedChat);
                const updatedThreadIds = parsedChat.filter(chat => chat.thread_id !== thread_id).map(chat => chat.thread_id);
                await AsyncStorage.setItem('chat', JSON.stringify(parsedChat.filter(chat => chat.thread_id !== thread_id)));
                await AsyncStorage.setItem('thread_ids', JSON.stringify(updatedThreadIds));
            }

            // delete description from state and AsyncStorage
            setDescriptions(prevDescriptions => {
                
                const updatedDescriptions = prevDescriptions.filter(desc => desc.thread_id !== thread_id);
                saveDescriptionsInStorage(updatedDescriptions);
                return updatedDescriptions;
            });
            
            
        } 
        catch (error) {
            console.error('Error deleting thread from storage:', error);
        }
    }

    // add different function that filteres from other chat.
    function getChatForThread(thread_id) {
        if (!chat || !Array.isArray(chat)) {
           return [];
        }
        return chat.filter(chatItem => chatItem.thread_id === thread_id);
    }

    async function generateDescriptions(currentThreadId) {
        //don't set description if description is already set
        console.log('chat', chat)
        const chatlength = chat.filter(message => message.thread_id === currentThreadId).length
        console.log(chatlength)
        if (descriptions[currentThreadId] !== 'Begin een chat met ChatGPT!' && chatlength >= 2){
            console.log('description already set')
            return
        }

        let threadChat;
        try {
            threadChat = chat.filter((chat) => chat.thread_id === currentThreadId);
        }
        catch (error) {
            threadChat = [];
        }

        //don't set description if chat is empty
        if (threadChat.length === 0) {
            console.log('chat is empty')
            return 
        }
        

        // If chat is empty, skip generating description
        const chatSummary = threadChat.map((chat) => (
            {
            question: chat.question, 
            answer: ''//chat.answer 
        }))


        const chatParagraph = generateDescription(chatSummary)
        const message = `Please provide a succinct description of this chat in Dutch, limited to just 5 words. Here's the chat to describe: ${JSON.stringify(chatParagraph)}`
        const titleRequest = `Please create a concise title in Dutch for this chat, using strictly 3 words and without any punctuation. Here's the chat content: ${JSON.stringify(chatParagraph)}`

        const descriptionResponse = await postDescriptionMessage(message);
        const description = descriptionResponse.replace(/"/g, '')
        const titleResponse = await postDescriptionMessage(titleRequest);
        const title = titleResponse.replace(/"/g, '')

        setDescriptions(prevDescriptions => {
            const existingDescriptionIndex = prevDescriptions.findIndex(desc => desc.thread_id === currentThreadId);
            if (existingDescriptionIndex !== -1) {
                // Update existing description
                const updatedDescriptions = [...prevDescriptions];
                updatedDescriptions[existingDescriptionIndex] = { thread_id: currentThreadId, description, title };
                saveDescriptionsInStorage(updatedDescriptions);
                return updatedDescriptions;
            } 
            else {
                // Add new description
                const newDescriptions = [...prevDescriptions, { thread_id: currentThreadId, description, title }];
                saveDescriptionsInStorage(newDescriptions);
                return newDescriptions;
            }
        }); //save this in storage
        console.log('Description set')
        setFirstDescription(false)
    }
    

    function getDescriptionsForThreadId(threadID) {
        const description = descriptions
            .filter((desc) => {
                if (desc.thread_id === threadID){
                    return {
                        description: desc.description,
                        title: desc.title
                    }
                }   
            });

        try {
            const descriptionText = JSON.stringify(description[0].description);
            const titleText = JSON.stringify(description[0].title);
            return {
                description: descriptionText.slice(1, -1),
                title: titleText.slice(1, -1)
            };
        }
        catch (error) {
            const descriptionText = 'Chat met ChatGPT om antwoord te krijgen op jouw vraggen! ';
            return {
                description: descriptionText,
                title: 'Begin met Chatten!'
            };
        }
    }

    const values = {
        chat,
        thread_ids,
        currentThreadId,
        addThread_ID,
        setThreadId,
        addChat,
        deleteThread_ID,
        initializeChatHistory,
        getChatForThread,
        getDescriptionsForThreadId
    }
    return (
        <ChatContext.Provider value={values}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatContextProvider;




//--------------------Helper functions--------------------//
function generateDescription(chatSummary) {
  let description = '';
  for (let i = 0; i < chatSummary.length; i++) {
    const { question, answer } = chatSummary[i];
    if (question) {
      description += question + ' ';
    }
    if (answer) {
      description += answer + ' ';
    }
  }
  return description.trim();
}