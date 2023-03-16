import React, { useContext, useRef, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, KeyboardAvoidingView, SafeAreaView, ImageBackground, Animated } from 'react-native';
import { postMessage } from '../../hooks/chatgpt';
import { ColorsBlue } from '../../constants/palet';
import Icon from '../Icon';
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ChatBoxUser from './ChatBoxUser';
import ChatBoxGPT from './ChatBoxGPT';
import InputContainer from './InputContainer';
import { ChatContext } from '../../store/chat-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { UserProfileContext } from '../../store/userProfile-context';
import LoadingOverlay from '../UI/LoadingOverlay';
import { useRoute } from '@react-navigation/native';
import LoadingChat from '../UI/LoadingChat';


const heightTextInput = 40;
const marginBottomTextInput = 10;
const marginTopTextInput = 10;
const paddingChat = heightTextInput + marginBottomTextInput + marginTopTextInput;

const Chat = ({keyboardHeight}) => {  
    const chatCtx = useContext(ChatContext)
    const userprofileCtx = useContext(UserProfileContext)
    const [inputValue, setInputValue] = useState('');
    const flatListRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const route = useRoute();
    
    //get thread id from router and set it as current thread id
    const thread_id = route.params.thread_id;
    const currentChatData = chatCtx.getChatForThread(thread_id);

    // sending message to chatgpt
    const sendMessage = async () => {
        setIsLoading(true);
        const tempInput = inputValue;
        
        //clear input
        setInputValue('');
        
        console.log(`Checking current thread ${chatCtx.currentThreadId}`)
        const chatQuestion = {
          question: tempInput,
          thread_id: chatCtx.currentThreadId
        }
        chatCtx.addChat(chatQuestion);
        
        //posting message to database
        let answeredMessage = await postMessage(userprofileCtx.userprofile.id, tempInput, chatCtx.currentThreadId);

        if (!answeredMessage) {
            answeredMessage = 'Sorry, I don\'t understand that. Please try again.'
        }
        //adding message to chat
        const botMessage = answeredMessage//answeredMessage.data.choices[0].text;
        
        //save chat to local storage
        const chatAnswer = {
            answer: botMessage,
            thread_id: chatCtx.currentThreadId
        }
        chatCtx.addChat(chatAnswer);
        
        setIsLoading(false);
        
        //scroll to end
        flatListRef.current.scrollToEnd();
      }

    const renderChat = ({ item, index}) => {
      const isLastItem = index === currentChatData.length - 1; // check if the current item is the last one
      return (
        <>
          {item.question && (
            <View style={{ alignItems: 'flex-end', marginRight: 10 }}>
              <ChatBoxUser question={item.question} />
            </View>
          )}
          {item.answer ? (
            <View style={{ alignItems: 'flex-start', marginLeft: 10 }}>
              <ChatBoxGPT answer={item.answer} />
            </View>
          ) : (
            isLoading &&
            isLastItem && ( // show loading overlay only for the last item
              <LoadingChat message="Waiting on chatgpt's response..." />
            )
          )}
        </>
      );
    };
    return (

      <View style = {styles.container}>
        <ImageBackground
          source={require('./../../../assets/chatbackground.png')} 
          style={
          {flex: 1, resizeMode: 'contain'}
          }
          imageStyle={{opacity: 0.15}}
        >
          <Animated.View style = {{flex: 1, marginBottom: keyboardHeight}}>
            <View style = {styles.chat}>
              <FlatList 
                ref={flatListRef} // Set ref to FlatList
                data = {currentChatData}
                keyExtractor = {(item, index) => index}
                renderItem = {renderChat}
                onContentSizeChange={() => flatListRef.current.scrollToEnd()} // Scroll to the end on content size change
                onLayout={() => flatListRef.current.scrollToEnd()} // Scroll to the end on layout change
              />
            </View>
            <InputContainer
              setInputValue={setInputValue}
              inputValue={inputValue}
              sendMessage={sendMessage}
              heightTextInput={heightTextInput}
              marginBottomTextInput={marginBottomTextInput}
              marginTopTextInput={marginTopTextInput}
            />
        </Animated.View>
      </ImageBackground>
    </View>

    );
};

export default Chat;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorsBlue.blue1300,
    borderTopColor: ColorsBlue.blue100,
    borderTopWidth: 0.4,
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  chat: {
    paddingBottom: paddingChat,
  },

});