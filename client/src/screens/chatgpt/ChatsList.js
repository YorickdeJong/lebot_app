

import { useNavigation } from '@react-navigation/native'
import { useContext, useEffect, useLayoutEffect, useState } from 'react'
import {Text, View, StyleSheet, Alert, ImageBackground} from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import ChatSelectionTile from '../../components/chatgpt/ChatSelectionTile'
import Icon from '../../components/Icon'
import { ColorsBlue } from '../../constants/palet'
import { ChatContext } from '../../store/chat-context'
import { LinearGradient } from 'expo-linear-gradient'

function Chats({navigation, route}) {
    const chatCtx = useContext(ChatContext)

    console.log(`CHECK CHATGPT`)
    useEffect(() => {
    }, [chatCtx.thread_ids]);

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
        <LinearGradient 
            colors={['rgba(2,2,13,1)', 'rgba(2,2,8,1)']}  
            style = {styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            >            
            <ImageBackground
                source={require('./../../../assets/chatbackground.png')} 
                style={
                {flex: 1, resizeMode: 'contain'}
                }
                imageStyle={{opacity: 0.05}}
                >
                <View style = {{flex: 7}}>
                    <FlatList 
                    KeyExtractor = {(item) => item}
                    data = {chatCtx.thread_ids}
                    renderItem = {renderChats}
                    />
                </View>
            </ImageBackground>
        </LinearGradient>
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
        flex: 1,
        backgroundColor: ColorsBlue.blue1400,
    }
})