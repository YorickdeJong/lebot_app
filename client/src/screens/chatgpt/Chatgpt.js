
import { useEffect, useRef } from 'react';
import { Keyboard, Animated } from 'react-native';
import Chat from '../../components/chatgpt/Chat'


function ChatGPT() {

    const keyboardHeight = useRef(new Animated.Value(0)).current;
    keyboardWillShow = (event) => {
        Animated.parallel([
        Animated.timing(keyboardHeight, {
            duration: event.duration,
            toValue: event.endCoordinates.height / 1.3,
            useNativeDriver: false
        }),
        ]).start();
    };

    keyboardWillHide = (event) => {
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
        <Chat 
        keyboardHeight={keyboardHeight}/>
    )
}

export default ChatGPT










