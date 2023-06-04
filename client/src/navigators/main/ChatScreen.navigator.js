import {useNavigation, } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useCallback, useContext } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {Alert } from 'react-native';
import Icon from '../../components/Icon';
import ChatGPT from '../../screens/chatgpt/Chatgpt';
import Chats from '../../screens/chatgpt/ChatsList';
import { ColorsBlue } from '../../constants/palet';
import { ChatContext } from '../../store/chat-context';
import CustomHeader from './CustomNavigator.main';


//test
const Stack = createNativeStackNavigator()

//DISPLAYS CHATGPT SCREEN COMPONENTS
function ChatScreen() {
    const navigation = useNavigation();
    const chatCtx = useContext(ChatContext);
    const thread_id = chatCtx.thread_ids.length
  
    const {title} = chatCtx.getDescriptionsForThreadId(chatCtx.currentThreadId)
  

    function addChatHandler() {
        console.log(`threadId length: ${chatCtx.thread_ids.length}`)
        if (chatCtx.thread_ids.length >= 5) { //Maybe need to change this to include the preset chats
            Alert.alert('Je mag maar 5 chats tegelijk hebben.')
            return;
        }

        //generate new thread_id between 1 and 5 and check if the thread id has already been taken
        let newThreadId;
        do {
            newThreadId = Math.floor(Math.random() * 5) + 1; // Generate random ID between 1 and 5
        } 
        while (chatCtx.thread_ids.includes(newThreadId)); // Check if it already exists in thread_ids

        if (chatCtx.thread_ids.length === 0) {
            chatCtx.addThread_ID(newThreadId); //Ad to generate a description
            navigation.navigate('Chat', {
                thread_id: newThreadId
            })
            return;
        }

        //check if current chat has been answered
        const currentThreadId = chatCtx.thread_ids[chatCtx.thread_ids.length - 1];
        
        const currentChat = chatCtx.chat.filter(chat => chat.thread_id === currentThreadId);

        if (currentChat.length === 0 || !currentChat[0]["question"]) {
            Alert.alert('Beantwoord eerst de vragen van je huidige chat.')
            return;
        }

        //Create new thread_id without boundary checks
        chatCtx.addThread_ID(newThreadId);
        navigation.navigate('Chat', {
                thread_id: newThreadId
        })
    }

    return (
      <Stack.Navigator
        screenOptions={{
          headerTintColor: 'white',

          header: ({ route }) => {
              const showChatPlus = route.name === 'Chats';
              const showChatBubbles = route.name === 'Chat';
              return (
                <CustomHeader
                chatBubbles={showChatBubbles}
                chatPlus={showChatPlus}
                onCustomHeaderLayout={addChatHandler}
                />

              );
          },
          headerStyle: {
            backgroundColor: 'transparent',
            elevation: 0,
          },
          }}
          >
  
          <Stack.Screen 
          component={Chats}
          name = "Chats"
          options = {{
            title: 'Chat Threads',
            showListIcon: false,
          }}
          />
  
          <Stack.Screen 
          component={ChatGPT}
          name = "Chat"
          options= {{
            title: title  
          }}
          initialParams={{ thread_id }}
          />
  
      </Stack.Navigator>
    )
  }

  export default ChatScreen