import { LinearGradient } from 'expo-linear-gradient'
import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native'
import {useRef} from 'react'
import { ColorsBlue } from '../../../constants/palet'
import { ASSIGNMENT_EXPLANATION } from '../../../data/InitialAssignmentExplanation'
import Chat from '../../chatgpt/Chat'
import ChatBoxGPT from '../../chatgpt/ChatBoxGPT'
import SwitchScreens from '../BuildComponent.js/SwitchScreens'
import TextDisplay from '../BuildComponent.js/TextDisplay'
import VideoDisplay from '../BuildComponent.js/VideoDisplay'

    
function IntroScreenQuestions({nextSlideHandler, prevSlideHandler, slideCount, setSlideCount, setTyping, typing, answer, thread_id, title, description, isFocused, video, slideCountEnd}){    
    const scrollViewRef = useRef(null)
    const extraStyle = {
        marginLeft: 8,
        paddingLeft: 3,
        borderRadius: 10,
    }

    return(
        <LinearGradient
            colors={[ColorsBlue.blue1400, ColorsBlue.blue1400, ColorsBlue.blue1400, ColorsBlue.blue1400, ColorsBlue.blue1300, ColorsBlue.blue1400]} 
            style = {styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            >
                <ImageBackground
                source={require('./../../../../assets/chatbackground.png')} 
                style={
                {flex: 1}
                }
                imageStyle={{opacity: slideCount >= 0 ? 0.10 : 0.15}}
                >
                {video && (
                    <VideoDisplay
                    video={video}
                    />                
                )}
                <View style = {styles.textContainer}>
                    <TextDisplay
                    title = {title}
                    description= {description}
                    showIcon
                    differentIcon="home-outline"
                    setCloseHandler={() => setSlideCount(0)}
                    iconSize = {28}
                    />
                </View>
                    <ScrollView style = {{flex: 1}}
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>
                            <View style={{ alignItems: 'flex-start', marginLeft: 10, paddingTop: 10 }}>
                                {isFocused && <ChatBoxGPT 
                                answer={answer}
                                isLastItem={true}
                                thread_id={thread_id}
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
                                    slideCountEnd={slideCountEnd}
                                    />
                                )}
                    </ScrollView>  
            </ImageBackground>
        </LinearGradient>
    )
}


export default IntroScreenQuestions

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        paddingBottom: 5
    },
    textContainer: {
        backgroundColor: 'rgba(0, 0, 20, 0.75)',
    }
})