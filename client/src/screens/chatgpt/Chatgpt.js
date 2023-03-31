
import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useRef, useState } from 'react';
import { Keyboard, Animated, View, StyleSheet, ImageBackground } from 'react-native';
import Chat from '../../components/chatgpt/Chat'
import { ChatContext } from '../../store/chat-context';
import { ColorsBlue } from '../../constants/palet';
import { BlurView } from 'expo-blur';


function ChatGPT() {
    const isFocused = useIsFocused();
    const chatCtx = useContext(ChatContext);
    const [lastSelectedThreadId, setLastSelectedThreadId] = useState(chatCtx.currentThreadId);
    const keyboardHeight = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isFocused && lastSelectedThreadId !== undefined) {
            chatCtx.setThreadId(lastSelectedThreadId);
        }
    }, [lastSelectedThreadId, isFocused]);
    
    const keyboardWillShow = (event) => {
        Animated.parallel([
        Animated.timing(keyboardHeight, {
            duration: event.duration,
            toValue: event.endCoordinates.height / 1.3,
            useNativeDriver: false
        }),
    ]).start();
    };
    
    const keyboardWillHide = (event) => {
        setLastSelectedThreadId(chatCtx.currentThreadId);
        Animated.parallel([
        Animated.timing(keyboardHeight, {
            duration: event.duration,
            toValue: 0,
            useNativeDriver: false
        }),
        ]).start();
    };
    
    useEffect(() => {

        const keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', keyboardWillShow);
        const keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', keyboardWillHide);

        return () => {
            keyboardWillShowSub.remove();
            keyboardWillHideSub.remove();
        }
    }, []);

    return (
        <View style = {styles.container}>
            <ImageBackground
            source={require('./../../../assets/chatbackground.png')} 
            style={
            {flex: 1, resizeMode: 'contain'}
            }
            imageStyle={{opacity: 0.18}}
            >
                <BlurView style = {{flex: 1}} intensity={ 3 } >
                    <Chat 
                    keyboardHeight={keyboardHeight}
                    />
                </BlurView>
            </ImageBackground>
        </View>
    )
}

export default ChatGPT


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorsBlue.blue1400,
        borderTopColor: ColorsBlue.blue900,
        borderTopWidth: 1
    },
    contentContainerStyle: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },

});







