import {  ImageBackground, ScrollView, StyleSheet,  View, Dimensions } from 'react-native';
import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import { ColorsBlue, ColorsGray, } from '../../../constants/palet';
import ChatBoxGPT from '../../chatgpt/ChatBoxGPT';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import TextDisplay from './TextDisplay';
import VideoDisplay from './VideoDisplay';
import SwitchScreens from './SwitchScreens';
import { BlinkContext } from '../../../store/animation-context';
import { ShowIconsContext } from '../../../store/show-icons-context';
import AssignmentOptionsBar from '../questions/assignmentOptionsBar';
import ImageRendering from './ImageRendering';

const { width: SCREEN_WIDTH } = Dimensions.get('window');


function BatteryScreen({nextSlideHandler, setSlideCount, text, instructions, slideTotal, prevSlideHandler, slideCount, index, setTyping, typing, message, video, currentSlidePosition, isFocused, slideCountEnd, setIcon, screenType}){
    const isScreenFocused = slideCount - 1 === index
    
    
    const scrollViewRef = useRef(null);
    const extraStyle = {
        marginLeft: 8,
        borderRadius: 10,
        paddingLeft: 5
    }

    const showIconCtx = useContext(ShowIconsContext);
    const blinkCtx = useContext(BlinkContext);

    useEffect(() => {
        if (isFocused && screenType === 'coding' && slideCount === 0 && setIcon && !showIconCtx.showIcons.chatgpt) { //
            setIcon();
            blinkCtx.setShouldBlink(true);
        } 
    }, [isFocused, slideCount]);

    return (
            <View style = {styles.container}>
                <AssignmentOptionsBar
                    slideCount = {slideCount}
                    nextSlideHandler = {nextSlideHandler}
                    prevSlideHandler = {prevSlideHandler}
                    slideCountEnd = {slideCountEnd}
                    setSlideCount = {setSlideCount}
                    slideTotal = {slideTotal}
                    currentSlidePosition = {currentSlidePosition}
                    noPlanet = {true}
                    text = {text}
                />
                    {isScreenFocused && 
                    <ScrollView 
                        style = {{flex: 1, }}
                        ref={scrollViewRef}
                        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                        >

                            <>
                                {!instructions && <VideoDisplay 
                                    video = {video}/>
                                }

                                {!instructions && 
                                    <ImageRendering />
                                }
                                <ChatBoxGPT 
                                answer={message.answer}
                                isLastItem={true}
                                thread_id={message.thread_id}
                                setTyping={setTyping}
                                typing={typing}
                                extraStyle={extraStyle}
                                />
                            </>
                    </ScrollView>
                    }    
            </View>

    )
}

export default React.memo(BatteryScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        width: SCREEN_WIDTH,
    },
    imageBackground: { 
        flex: 1, 
        resizeMode: 'contain',
    },
})