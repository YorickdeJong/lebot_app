import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { ImageBackground, StyleSheet, View } from 'react-native'
import { ColorsBlue } from '../../../constants/palet'
import Chat from '../../chatgpt/Chat'
import ChatBoxGPT from '../../chatgpt/ChatBoxGPT'
import SwitchScreens from './SwitchScreens'
import TextDisplay from './TextDisplay'
import VideoDisplay from './VideoDisplay'




function IntroScreen({nextSlideHandler, prevSlideHandler, slideCount, title, description, video, message, setTyping, typing}){
    
    const extraStyle = {
        marginLeft: 8,
        borderRadius: 10,
        paddingLeft: 5
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
                    <VideoDisplay 
                    video = {video}/>
                        <TextDisplay
                        title = {title}
                        description= {description}
                        />
                        <View style={{ alignItems: 'flex-start', marginLeft: 10, paddingTop: 10 }}>
                            <ChatBoxGPT 
                            answer={message.answer}
                            isLastItem={true}
                            thread_id={message.thread_id}
                            setTyping={setTyping}
                            typing={typing}
                            extraStyle={extraStyle}
                            />
                            {!typing && (
                            <SwitchScreens 
                            prevSlideHandler={prevSlideHandler}
                            nextSlideHandler={nextSlideHandler}
                            slideCount={slideCount}
                            />
                            )}
                        </View>
            </ImageBackground>
        </LinearGradient>
    )
}

export default React.memo(IntroScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        paddingBottom: 5
    },
})