import {  ImageBackground, ScrollView, StyleSheet,  View } from 'react-native';
import {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
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


function BatteryScreen({nextSlideHandler, setSlideCount, prevSlideHandler, slideCount, setTyping, typing, message, video, title, description, isFocused, slideCountEnd, setIcon, screenType}){
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
        <LinearGradient 
                colors={['rgba(2,2,13,1)', 'rgba(2,2,8,1)']}  
                style = {styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                >
                <ImageBackground
                source={require('./../../../../assets/chatbackground.png')} 
                style={
                {flex: 1}
                }
                imageStyle={{opacity: 0.07}}
                >
                
                <AssignmentOptionsBar
                    slideCount = {slideCount}
                    nextSlideHandler = {nextSlideHandler}
                    prevSlideHandler = {prevSlideHandler}
                    slideCountEnd = {slideCountEnd}
                    setSlideCount = {setSlideCount}
                />
                <VideoDisplay 
                video = {video}/>
                <TextDisplay 
                title={title}
                description={description}/>

                    <ScrollView 
                        style = {{flex: 1, marginTop: 12}}
                        ref={scrollViewRef}
                        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                        >
                            {isFocused && <ChatBoxGPT 
                            answer={message.answer}
                            isLastItem={true}
                            thread_id={message.thread_id}
                            setTyping={setTyping}
                            typing={typing}
                            extraStyle={extraStyle}
                            />}
                    </ScrollView>    
                </ImageBackground>
            </LinearGradient>
    )
}

export default BatteryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
    },
    imageBackground: { 
        flex: 1, 
        resizeMode: 'contain',
    },
})