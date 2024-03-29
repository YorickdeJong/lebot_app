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
import Icon from '../../../Icon';
import CodeEditorScreen from '../../CodingQuestions/CodeEditorScreen';

function CodingQuestionsThree({isFocused}){
    const keyboardHeight = useRef(new Animated.Value(0)).current;
    const [slideCount, setSlideCount] = useState(0);
    const [typing, setTyping] = useState(true);
    const [close, setClose] = useState(false);


    //upon changing to this screen, set the thread id to the first thread id

    console.log(`check CodingScreen`)

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
    <LinearGradient
            colors={[ColorsBlue.blue1400, ColorsBlue.blue1400, ColorsBlue.blue1400, ColorsBlue.blue1400, ColorsBlue.blue1300, ColorsBlue.blue1400]}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <ImageBackground
                source={require('./../../../../../assets/chatbackground.png')} 
                style={styles.container}
                imageStyle={{opacity: 0.15}}
            >
                    <CodeEditorScreen close = {close}/>
                    {!close ? 
                    <>
                    <TextDisplay 
                    title="Codeer Vragen"
                    description="In dit onderdeel wordt jouw kennis getest"
                    showIcon
                    setCloseHandler={setCloseHandler}/>
                
                    <ScrollView style = {{flex: 1}}>
                            <View style={{ alignItems: 'flex-start', marginLeft: 10, paddingTop: 10 }}>
                                {isFocused && <ChatBoxGPT 
                                answer={ASSIGNMENT_EXPLANATION.CODINGQUESTIONS_1.answer}
                                isLastItem={true}
                                thread_id={ASSIGNMENT_EXPLANATION.CODINGQUESTIONS_1.thread_id}
                                setTyping={setTyping}
                                typing={typing}
                                extraStyle={extraStyle}
                                />}
                            </View>
                                {!typing && (
                                    <SwitchScreens 
                                    prevSlideHandler={prevSlideHandler}
                                    nextSlideHandler={nextSlideHandler}
                                    slideCount={slideCount}
                                    />
                                )}
                </ScrollView> 
                </>: 
                <View style = {styles.compress}>
                    <Icon
                    size = {30 }
                    color = {ColorsBlue.blue200}
                    icon="lock-open-outline"
                    onPress={setCloseHandler}/>
                </View> }
            </ImageBackground>
        </LinearGradient>
    );
}

export default React.memo(CodingQuestionsThree)

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
    }
})