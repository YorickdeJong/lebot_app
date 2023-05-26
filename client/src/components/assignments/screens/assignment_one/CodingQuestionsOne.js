import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground, Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { ColorsBlue } from '../../../../constants/palet';
import { ASSIGNMENT_EXPLANATION } from '../../../../data/InitialAssignmentExplanation';
import { ChatContext } from '../../../../store/chat-context';
import ChatBoxGPT from '../../../chatgpt/ChatBoxGPT';
import SwitchScreens from '../../BuildComponent.js/SwitchScreens';
import TextDisplay from '../../BuildComponent.js/TextDisplay';
import CodeEditorScreen from '../../CodingQuestions/CodeEditor';
import Icon from '../../../Icon';
import AssignmentOptionsBar from '../../questions/assignmentOptionsBar';

function CodingQuestionsOne({isFocused}){
    const keyboardHeight = useRef(new Animated.Value(0)).current;
    const [slideCount, setSlideCount] = useState(0);
    const [typing, setTyping] = useState(true);
    const [close, setClose] = useState(false);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        console.log(slideCount)
    }, [slideCount])
    
    useEffect(() => {
        const keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', keyboardWillShow);
        const keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', keyboardWillHide);

        return () => {
            keyboardWillShowSub.remove();
            keyboardWillHideSub.remove();
        }
    }, []);
    
    

    function setCloseHandler(){
        setClose(!close);
    }

    function nextSlideHandler(){
        console.log(`next slide handled`)
        setSlideCount(slideCount + 1);
        setTyping(true);
    }

    function prevSlideHandler(){
        console.log(`prev slide handled`)
        setSlideCount(slideCount - 1);
        setTyping(true);
    }

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
        Animated.parallel([
        Animated.timing(keyboardHeight, {
            duration: event.duration,
            toValue: 0,
            useNativeDriver: false
        }),
        ]).start();
    };

    const extraStyle = {
        marginLeft: 8,
        borderRadius: 10,
        paddingLeft: 5
    }

    return (
        <View style = {styles.container}>
                    <AssignmentOptionsBar 
                        nextSlideHandler = {nextSlideHandler}
                        prevSlideHandler = {prevSlideHandler}
                        setSlideCount = {setSlideCount}
                        text = {{text: 'Uitleg', left: '44%' }}
                        noForwardArrow = {true}
                        slideTotal = {1}
                        slideCount= {1}
                        noPlanet = {true}
                    />

                    <CodeEditorScreen close = {close}/>
                    {!close ? 
                    <>
                    
                
                    <ScrollView 
                    style = {{flex: 1, marginTop: 8}}
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                    >
                        
                        {isFocused && <ChatBoxGPT 
                        answer={ASSIGNMENT_EXPLANATION.CODINGQUESTIONS_1.answer}
                        isLastItem={true}
                        thread_id={ASSIGNMENT_EXPLANATION.CODINGQUESTIONS_1.thread_id}
                        setTyping={setTyping}
                        typing={typing}
                        extraStyle={extraStyle}
                        />}
    
                    </ScrollView> 
                    </>: 

                    <View style = {styles.compress}>
                        <Icon
                        size = {30 }
                        color = {ColorsBlue.blue200}
                        icon="lock-open-outline"
                        onPress={setCloseHandler}/>
                    </View> }
        </View>
    );
}

export default React.memo(CodingQuestionsOne)

const styles  = StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: 'contain'
    },
    border: {
        borderBottomColor: `rgba(77, 77, 77, 0.5)`,
        borderBottomWidth: 0.6,
        shadowColor: `rgba(33, 33, 33`,
        shadowOffset: {height: 1, width: 0},
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 1,
    },
    compress: {
        position: 'absolute',
        top: "93%",
        left: 10,
    },
    textContainer: {
        backgroundColor: 'rgba(0, 0, 20, 0.75)',
    }
})