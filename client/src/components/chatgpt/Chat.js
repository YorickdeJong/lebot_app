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

const Chat = ({keyboardHeight, nextSlideHandler, prevSlideHandler, slideCount}) => {  
    const chatCtx = useContext(ChatContext)
    const userprofileCtx = useContext(UserProfileContext)
    const [inputValue, setInputValue] = useState('');
    const flatListRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const thread_id = chatCtx.currentThreadId;
    const currentChatData = chatCtx.getChatForThread(thread_id);
    const [typing, setTyping] = useState(true);


    // sending message to chatgpt
    const sendMessage = async () => {
        setIsLoading(true);
        const tempInput = inputValue;
        
        //clear input
        setInputValue('');
        
        console.log(`Checking current thread ${thread_id}`)

        const chatQuestion = {
          question: tempInput,
          thread_id: thread_id
        }
        chatCtx.addChat(chatQuestion);
        console.log(currentChatData)
        console.log(`chat question ${JSON.stringify(chatQuestion)}`)
        //posting message to database
        let answeredMessage = await postMessage(userprofileCtx.userprofile.id, tempInput, thread_id);

        if (!answeredMessage) {
            answeredMessage = 'Sorry, I don\'t understand that. Please try again.'
        }
        //adding message to chat
        const botMessage = answeredMessage//answeredMessage.data.choices[0].text;
        
        //save chat to local storage
        const chatAnswer = {
            answer: botMessage,
            thread_id: thread_id
        }

        console.log(`chat answer ${JSON.stringify(chatAnswer)}`)
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
              <ChatBoxUser question={item.question} 
              />
            </View>
          )}
          {item.answer ? (
            <View style={{ alignItems: 'flex-start', marginLeft: 10 }}>
              <ChatBoxGPT answer={item.answer} 
              isLastItem = {isLastItem}
              thread_id={thread_id}
              setTyping={setTyping}
              typing={typing}/>
            </View>
          ) : (
            isLoading &&
            isLastItem && ( // show loading overlay only for the last item
            <LoadingChat message="Waiting on chatgpt's response..." />
            )
            )}
            {
              // show next button only for the first item for assignment explanations
              index === 0 && thread_id > 5 && !typing && (
                <SwitchScreens 
                prevSlideHandler={prevSlideHandler}
                nextSlideHandler={nextSlideHandler}
                slideCount={slideCount}
                />
              )
            }
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
              setInputValue={setInputValue}
              inputValue={inputValue}
              sendMessage={sendMessage}
              heightTextInput={heightTextInput}
              marginBottomTextInput={marginBottomTextInput}
              marginTopTextInput={marginTopTextInput}
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