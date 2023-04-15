import {useNavigation, } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

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
  
    return (
      <Stack.Navigator
        screenOptions={{
          headerTintColor: 'white',

          header: ({ route }) => {
              const showChatPlus = route.name === 'Chats';
              const showChatBubbles = route.name === 'Chat';
              return (
                <CustomHeader
                  title={route.name}
                  chatBubbles={showChatBubbles}
                  chatPlus={showChatPlus}
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