import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { ASSIGNMENT_EXPLANATION } from "../data/InitialAssignmentExplanation";
import { deleteMessage, getChatHistory, postDescriptionMessage } from "../hooks/chatgpt";
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
    const [descriptions, setDescriptions] = useState([]);
    const userprofileCtx = useContext(UserProfileContext);

    const user_id = userprofileCtx.userprofile.id;

    useEffect(() => { 
        loadChatFromStorage();
    }, [])
    
    // if chat changes, descriptions are loaded
    useEffect(() => {
        if (currentThreadId > 5) {
            return;
        }
        console.log(`check`)
        generateDescriptions(currentThreadId)
    },[chat])


    // Load chat data from storage
    async function loadChatFromStorage() {
        try {
            const chatJSON = await AsyncStorage.getItem("chat");
            const thread_idsJSON = await AsyncStorage.getItem("thread_ids");
            const uniqueThreadIds = JSON.parse(thread_idsJSON).filter((value, index, self) => {
                    return self.indexOf(value) === index;
            });
            const descriptionsJSON = await AsyncStorage.getItem("descriptions");
            if (chatJSON !== null) {
                setChat(JSON.parse(chatJSON));
            }

            if (uniqueThreadIds) {
                setThreadIds(uniqueThreadIds);
                setCurrentThreadId(uniqueThreadIds.length);
                
            }
            if (descriptionsJSON !== null) {
                setDescriptions(JSON.parse(descriptionsJSON));
            }
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

            // Check if the first message in the chat has the same answer and thread_id as the chatMessage
            const currentThreadMessage = getChatForThread(chatMessage.thread_id);
            if (
                currentThreadMessage.length &&
                chatMessage.thread_id >= 5 &&
                currentThreadMessage[0].thread_id === chatMessage.thread_id &&
                currentThreadMessage[0].answer === chatMessage.answer
            ) {
                console.log('Message already set');
                return prevChat; // Don't add the chatMessage if it's the same as the first message in the chat
            }
        
            const newChatHistory = [...prevChat, chatMessage];
            saveChatInStorage(newChatHistory);
            return newChatHistory;
        });
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
        // for (const threadId of thread_ids) {
            const threadChat = chat.filter((chat) => chat.thread_id === currentThreadId);

            // If chat is empty, skip generating description
            const chatSummary = threadChat.map((chat) => (
                {
                question: chat.question, 
                answer: chat.answer 
            }))
            const chatParagraph = generateDescription(chatSummary)
            const message = `Please create a description of this chat in no more than 15 words: ${JSON.stringify(chatParagraph)} `  
            const titleRequest = `Please create a title for this chat in no more than 3 words, don't include punctuations: ${JSON.stringify(chatParagraph)}`

            const description = await postDescriptionMessage(message);
            const title = await postDescriptionMessage(titleRequest);


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
            console.log(`Description has not yet been set for chat ${threadID}`);
            const descriptionText = 'Have a chat with your friend to generate a description!';
            return {
                description: descriptionText,
                title: 'Chat Title'
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