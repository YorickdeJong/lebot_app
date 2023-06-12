import React, { useContext, useRef, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { postMessage } from '../../hooks/chatgpt';
import { FlatList } from 'react-native-gesture-handler';
import ChatBoxUser from './ChatBoxUser';
import ChatBoxGPT from './ChatBoxGPT';
import InputContainer from './InputContainer';
import { ChatContext } from '../../store/chat-context';
import { UserProfileContext } from '../../store/userProfile-context';
import LoadingChat from '../UI/LoadingChat';
import SwitchScreens from '../assignments/BuildComponent.js/SwitchScreens';

const heightTextInput = 40;
const marginBottomTextInput = 10;
const marginTopTextInput = 10;
const paddingChat = heightTextInput + marginBottomTextInput + marginTopTextInput; 

const Chat = ({keyboardHeight, placeholder, customThread_id, customColor, validateInput, inputContainer}) => {  
    const chatCtx = useContext(ChatContext)
    const [inputValue, setInputValue] = useState('');
    const flatListRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const thread_id = customThread_id ? customThread_id : chatCtx.currentThreadId;
    const currentChatData = chatCtx.getChatForThread(thread_id);
    const [typing, setTyping] = useState(true);



    const sendMessage = async () => {
        setIsLoading(true);
        const tempInput = inputValue;
        setInputValue(''); // clear input
    
        const chatQuestion = {
            question: tempInput,
            thread_id: thread_id
        }
    
        // Add the user's question to the chat immediately
        await chatCtx.addChat(chatQuestion);
        const chatgptAnswer = chatCtx.currentBotMessage.current
        // check answer if user uses chatgpt for answer questions
        if (validateInput) {
          validateInput(chatgptAnswer, inputValue)
        }

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
              <ChatBoxUser question={item.question} 
              />
            </View>
          )}
          {item.answer ? (
            <View style={{  marginLeft: 10, marginVertical: 10 }}>
              <ChatBoxGPT answer={item.answer} 
              isLastItem = {isLastItem}
              thread_id={thread_id}
              setTyping={setTyping}
              customColor={customColor}
              typing={typing}/>
            </View>
          ) : (
            isLoading &&
            isLastItem && ( // show loading overlay only for the last item
            <LoadingChat message="Wachten op Chatgpt's antwoord..." />
            )
            )}
        </>
      );
    };


    return (
          <Animated.View style = {{flex: 1, marginBottom: keyboardHeight}}>
            <View style = {styles.chat}>
              <FlatList 
                ref={flatListRef} // Set ref to FlatList
                data = {currentChatData}
                showsVerticalScrollIndicator = {false}
                keyExtractor = {(item, index) => index}
                renderItem = {renderChat}
                onContentSizeChange={() => flatListRef.current.scrollToEnd()} // Scroll to the end on content size change
                onLayout={() => flatListRef.current.scrollToEnd()} // Scroll to the end on layout change
              />
            </View>
            <InputContainer
              validateInput = {validateInput}
              placeholder={placeholder}
              setInputValue={setInputValue}
              inputValue={inputValue}
              sendMessage={sendMessage}
              heightTextInput={heightTextInput}
              marginBottomTextInput={marginBottomTextInput}
              marginTopTextInput={marginTopTextInput}
              inputContainer = {inputContainer}
            />
        </Animated.View>
    );
};

export default Chat;


const styles = StyleSheet.create({
  chat: {
      paddingBottom: paddingChat,
  },
})