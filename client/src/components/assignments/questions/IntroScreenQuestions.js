import { LinearGradient } from 'expo-linear-gradient'
import { ImageBackground, ScrollView, StyleSheet, View, Alert , Dimensions} from 'react-native'
import React, {useContext, useEffect, useRef} from 'react'
import { ColorsBlue } from '../../../constants/palet'
import { ASSIGNMENT_EXPLANATION } from '../../../data/InitialAssignmentExplanation'
import Chat from '../../chatgpt/Chat'
import ChatBoxGPT from '../../chatgpt/ChatBoxGPT'
import SwitchScreens from '../BuildComponent.js/SwitchScreens'
import TextDisplay from '../BuildComponent.js/TextDisplay'
import VideoDisplay from '../BuildComponent.js/VideoDisplay'
import { ShowIconsContext } from '../../../store/show-icons-context'
import { BlinkContext } from '../../../store/animation-context'
import AssignmentOptionsBar from './assignmentOptionsBar'
import { useIsFocused } from '../../../hooks/isFocused.hooks'

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function IntroScreenQuestions({nextSlideHandler, text, prevSlideHandler, onRenderedData, onRenderedImage, currentSlidePosition, slideIndex, slideTotal, slideCount, setSlideCount, setTyping, typing, answer, thread_id, index, description, isFocused, video, slideCountEnd, setIcon, screenType}){    
    const isScreenFocused = slideCount - 2 <= index && slideCount >= index

    const scrollViewRef = useRef(null)
    const extraStyle = {
        marginLeft: 8,
        paddingLeft: 3,
        borderRadius: 10,
    }
    
    const showIconCtx = useContext(ShowIconsContext);
    const blinkCtx = useContext(BlinkContext);

    useEffect(() => {
        if (isFocused && screenType === 'Motor' && slideCount === 1 && setIcon  && !showIconCtx.showIcons.robotStore) { //
            setIcon();
            blinkCtx.setShouldBlinkRobot(true);
        } 
    }, [isFocused, slideCount]);
    
    return(
        <View style = {styles.container}>
                <AssignmentOptionsBar 
                    slideCount = {slideCount}
                    nextSlideHandler = {nextSlideHandler}
                    prevSlideHandler = {prevSlideHandler}
                    slideCountEnd = {slideCountEnd}
                    setSlideCount = {setSlideCount}
                    text = {text}
                    slideTotal = {slideTotal}
                    currentSlidePosition = {currentSlidePosition}
                />

                    {isScreenFocused && <ScrollView style = {{flex: 1}}
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>
                        {video && (
                            <VideoDisplay
                            video={video}
                            />                
                        )}
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


export default React.memo(IntroScreenQuestions)

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        width: SCREEN_WIDTH,
    },
    textContainer: {
        backgroundColor: ColorsBlue.blue1390,
        marginTop: 8,
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: `rgba(77, 77, 77, 0.2)`,
        borderRadius: 20,
        shadowColor: `rgba(0, 0, 0, 1)`,
        shadowOffset: { height: 3, width: 1 },
        shadowRadius: 3,
        shadowOpacity: 1,
        elevation: 4,
    }
})