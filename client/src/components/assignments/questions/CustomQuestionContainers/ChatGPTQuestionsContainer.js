import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useRef, useState } from 'react';
import { Keyboard, Animated, View, StyleSheet, ImageBackground, Text } from 'react-native'
import Chat from '../../../chatgpt/Chat'
import { ColorsBlue, ColorsGray, ColorsRed } from '../../../../constants/palet';
import Icon from '../../../Icon';
import { ChatContext } from '../../../../store/chat-context';
import { UserProfileContext } from '../../../../store/userProfile-context';


function ChatGPTQuestionsContainer() {
    const keyboardHeight = useRef(new Animated.Value(0)).current;
    const chatCtx = useContext(ChatContext)
    const userprofileCtx = useContext(UserProfileContext)

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
            toValue: event.endCoordinates.height + 2,
            useNativeDriver: false
        }),
    ]).start();
    };
    
    const keyboardWillHide = (event) => {
        Animated.parallel([
        Animated.timing(keyboardHeight, {
            duration: event.duration,
            toValue: 0,
            useNativeDriver: false
        }),
        ]).start();
    };

    return (
        <Animated.View style = {[styles.container, {marginBottom: keyboardHeight ? keyboardHeight : 20}]}>
            <Icon 
                icon="trash-can-outline"
                size={28}
                onPress={() => chatCtx.deleteThread_ID(6)}
                color = {ColorsRed.red600}
                addStyle = {{position: 'absolute', top: 12, right: '3%'}}
                differentDir={true}
            />
            {userprofileCtx.userprofile.class_id &&
                <Chat 
                keyboardHeight={0}
                placeholder="Type hier je antwoord..."
                customThread_id={6}
                customColor = 'rgba(15, 10, 50, 1)'
                />
            }
            {!userprofileCtx.userprofile.class_id &&
            <View style = {{marginHorizontal: 20, marginBottom: 40}}>
                <Text style = {styles.text}>Voeg een klas toe om vragen te beantwoorden. Ga hiervoor naar instellingen en kies 'Groepen'</Text>
            </View>
            }
        
        
        </Animated.View>
    )
}

export default ChatGPTQuestionsContainer


const styles = StyleSheet.create({
    container: {
        minHeight: 120,
        paddingTop: 40,
        borderWidth: 1,
        borderColor: `rgba(77, 77, 77, 0.2)`,
        backgroundColor: ColorsBlue.blue1390,
        borderRadius: 20,
        shadowColor: `rgba(0, 0, 0, 1)`,
        shadowOffset: {height: 3, width: 2},
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 1,
        marginHorizontal: 8,
        marginTop: 0,
        marginBottom: 20,
    },
    text: {
        color: ColorsGray.gray300,
        fontSize: 22,
        textAlign: 'center',
        lineHeight: 26,

    }
})