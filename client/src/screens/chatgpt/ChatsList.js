

import { useNavigation } from '@react-navigation/native'
import { useContext, useEffect, useLayoutEffect, useState } from 'react'
import {Text, View, StyleSheet, Alert, ImageBackground} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import ChatSelectionTile from '../../components/chatgpt/ChatSelectionTile'
import Icon from '../../components/Icon'
import { ColorsBlue } from '../../constants/palet'
import { ChatContext } from '../../store/chat-context'

function Chats({navigation, route}) {
    const chatCtx = useContext(ChatContext)

    console.log(`CHECK CHATGPT`)
    useEffect(() => {
        
    }, [chatCtx.thread_ids]);
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Icon
                size={24}
                icon="chat-plus"
                color="white"
                addStyle={{ marginLeft: 15 }}
                onPress={addChatHandler}
                differentDir
                />
            ),
            headerRight: () => (
                <Icon
                size={24}
                icon="settings-sharp"
                color="white"
                addStyle={{ marginRight: 15 }}
                onPress={() => navigation.navigate('Settings')}
                />
            ),
        });
    }, [navigation, addChatHandler, chatCtx.thread_ids]);


    function addChatHandler() {
        console.log(`threadId length: ${chatCtx.thread_ids.length}`)
        if (chatCtx.thread_ids.length >= 5) { //Maybe need to change this to include the preset chats
            Alert.alert('You can only have 5 chats at a time.')
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
            Alert.alert('You must answer the question before you can start a new chat.')
            return;
        }

        //Create new thread_id without boundary checks
        chatCtx.addThread_ID(newThreadId);
        navigation.navigate('Chat', {
                thread_id: newThreadId
        })
    }


    function renderChats({item}) {
        console.log(`in chat handler thread id: ${item}`)
        function navigateToChatHandler() {
            chatCtx.setThreadId(item)
            navigation.navigate('Chat', {
                thread_id: item
            })
        }
        return (
            <ChatSelectionTile 
            thread_id = {item}
            navigateToChatHandler={navigateToChatHandler}
            />
        )
    }

    return (
        <View style = {styles.container}>
            <ImageBackground
            source={require('./../../../assets/chatbackground.png')} 
            style={
            {flex: 1, resizeMode: 'contain'}
            }
            imageStyle={{opacity: 0.15}}
            >
            <View style = {{flex: 7}}>
                <FlatList 
                KeyExtractor = {(item) => item}
                data = {chatCtx.thread_ids}
                renderItem = {renderChats}
                />
            </View>
        </ImageBackground>
        </View>
    )
}

export default Chats


const styles = StyleSheet.create({
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    container: {
        borderTopColor: ColorsBlue.blue900,
        borderTopWidth: 1,
        flex: 1,
        backgroundColor: ColorsBlue.blue1300,
    }
})