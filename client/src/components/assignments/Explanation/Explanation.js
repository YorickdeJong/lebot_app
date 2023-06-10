
import {  ImageBackground, ScrollView, StyleSheet,  View, Text, Dimensions } from 'react-native';
import React, {useEffect, useRef} from 'react';
import { ColorsBlue,} from '../../../constants/palet';
import ChatBoxGPT from '../../chatgpt/ChatBoxGPT';
import { LinearGradient } from 'expo-linear-gradient';
import VideoDisplay from '../BuildComponent.js/VideoDisplay';
import SwitchScreens from '../BuildComponent.js/SwitchScreens';
import SwitchScreensQuestions from '../questions/SwitchScreensQuestions';
import Icon from '../../Icon';
import AssignmentOptionsBar from '../questions/assignmentOptionsBar';
import { useIsFocused } from '../../../hooks/isFocused.hooks';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

function Explanation({nextSlideHandler, text, prevSlideHandler, currentSlidePosition, slideTotal, index, slideCount, setTyping, typing, answer, thread_id, video, isFocused, slideCountEnd, topic, ExplanationAnimation, setSlideCount}) {
    const isScreenFocused = slideCount - 2 <= index && slideCount >= index
    const scrollViewRef = useRef(null);

    const extraStyle = {
        marginLeft: 8,
        borderRadius: 10,
        paddingLeft: 5
    }


    const addStyle = {marginBottom: 20}
    return (
        <View style = {styles.container}>
                <AssignmentOptionsBar 
                    slideCount = {slideCount}
                    nextSlideHandler = {nextSlideHandler}
                    prevSlideHandler = {prevSlideHandler}
                    slideCountEnd = {slideCountEnd}
                    setSlideCount = {setSlideCount}
                    slideTotal = {slideTotal}
                    currentSlidePosition ={currentSlidePosition}
                    text = {text}
                />

                    {isScreenFocused && 
                    <ScrollView 
                    style = {{flex:1 }}
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                    >

                        
                            {isFocused && 
                            <ChatBoxGPT 
                            answer={answer}
                            isLastItem={true}
                            thread_id={thread_id}
                            setTyping={setTyping}
                            typing={typing}
                            extraStyle={extraStyle}
                            />}
            

                            
                    </ScrollView> 
                    }  
        </View>
    )
}

export default React.memo(Explanation)
    
const styles = StyleSheet.create({
        descriptionContainer: {
            backgroundColor: 'rgba(0, 0, 20, 0.75)',
            marginVertical: 8,
            elevation: 2,
            marginHorizontal: 8,
            borderRadius: 20,
            overflow: 'hidden',
            borderWidth: 0.6,
            borderColor: `rgba(0, 0, 0, 0.5)`,
        },
        container: {
            flex: 1, 
            width: SCREEN_WIDTH,
        },
        imageBackground: { 
            flex: 1, 
            resizeMode: 'contain',
        },
        textContainer: {
            backgroundColor: `rgba(25, 25, 85, 0.6)`,
            height: 53,
            shadowColor: `rgba(11, 11, 11)`,
            shadowOffset: {height: 2, width: 0},
            shadowOpacity: 1,
            shadowRadius: 3,
            elevation: 2,
            borderTopColor: `rgba(77, 77, 77, 0.6)`,
            borderTopWidth: 0.6,
            borderBottomColor: `rgba(77, 77, 77, 0.6)`,
            borderBottomWidth: 0.6,
            justifyContent: 'center',
        },
        text: {
            fontSize: 25,
            fontWeight: '300',
            color: ColorsBlue.blue50,
            textAlign: 'center',

        },
        leftSlider: {
            position: 'absolute',
            top: 6,
            left: 8
        },
        rightSlider: {
            position: 'absolute',
            top: 6,
            right: 8
        },
})
