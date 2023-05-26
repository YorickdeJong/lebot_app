
import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useRef, useState } from 'react';
import { Keyboard, Animated, View, StyleSheet, ImageBackground } from 'react-native';
import Chat from '../../components/chatgpt/Chat'
import { ChatContext } from '../../store/chat-context';
import { ColorsBlue } from '../../constants/palet';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';


function ChatGPT() {
    console.log(`CHECK CHAT`)
    
    const isFocused = useIsFocused();
    const chatCtx = useContext(ChatContext);
    const [lastSelectedThreadId, setLastSelectedThreadId] = useState(chatCtx.currentThreadId);
    const keyboardHeight = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isFocused && lastSelectedThreadId !== undefined) {
            chatCtx.setThreadId(lastSelectedThreadId);
        }
    }, [lastSelectedThreadId, isFocused]);
    
    useEffect(() => {

        const keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', keyboardWillShow);
        const keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', keyboardWillHide);

        return () => {
            keyboardWillShowSub.remove();
            keyboardWillHideSub.remove();
        }
    }, []);
    
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
    

    return (
        <LinearGradient 
                colors={[ColorsBlue.blueblack1600, ColorsBlue.blueblack1500]}  
                style = {styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                >
            <ImageBackground
            source={require('./../../../assets/chatbackground.png')} 
            style={
            {flex: 1, resizeMode: 'contain'}
            }
            imageStyle={{opacity: 0.12}}
            >
                    <Chat 
                    customColor = 'rgba(15, 10, 50, 1)'
                    keyboardHeight={keyboardHeight}
                    />
            </ImageBackground>
        </LinearGradient>
    )
}

export default ChatGPT


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorsBlue.blue1400,
    },
    contentContainerStyle: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },

});







