import { LinearGradient } from 'expo-linear-gradient'
import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native'
import {useContext, useEffect, useRef} from 'react'
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

    
function IntroScreenQuestions({nextSlideHandler, prevSlideHandler, slideCount, setSlideCount, setTyping, typing, answer, thread_id, title, description, isFocused, video, slideCountEnd, setIcon, screenType}){    
    const scrollViewRef = useRef(null)
    const extraStyle = {
        marginLeft: 8,
        paddingLeft: 3,
        borderRadius: 10,
    }

    const showIconCtx = useContext(ShowIconsContext);
    const blinkCtx = useContext(BlinkContext);

    useEffect(() => {
        console.log('robot', showIconCtx.showIcons.robotStore)
        console.log('slideCount', slideCount)
        if (isFocused && screenType === 'Motor' && slideCount === 1 && setIcon  && !showIconCtx.showIcons.robotStore) { //
            setIcon();
            blinkCtx.setShouldBlinkRobot(true);
        } 
    }, [isFocused, slideCount]);

    return(
        <LinearGradient 
                colors={['rgba(2, 2, 13, 1)', 'rgba(2, 2, 8, 1)']} 
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
                    text = {{text: 'Uitleg', left: '44%' }}
                />

                {video && (
                    <VideoDisplay
                    video={video}
                    />                
                )}
                    <TextDisplay
                    title = {title}
                    description= {description}
                    showIcon
                    differentIcon="planet"
                    setCloseHandler={() => setSlideCount(0)}
                    iconSize = {28}
                    />
                    <ScrollView style = {{flex: 1, marginTop: 15}}
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>
                            {isFocused && <ChatBoxGPT 
                            answer={answer}
                            isLastItem={true}
                            thread_id={thread_id}
                            setTyping={setTyping}
                            typing={typing}
                            extraStyle={extraStyle}
                            />}
                    </ScrollView>  

            </ImageBackground>
        </LinearGradient>
    )
}


export default IntroScreenQuestions

const styles = StyleSheet.create({
    container: {
        flex: 1, 
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