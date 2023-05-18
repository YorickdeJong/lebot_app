import {  ImageBackground, ScrollView, StyleSheet,  View } from 'react-native';
import { ColorsBlue, } from '../../../constants/palet';
import ChatBoxGPT from '../../chatgpt/ChatBoxGPT';
import { LinearGradient } from 'expo-linear-gradient';
import TextDisplay from '../BuildComponent.js/TextDisplay';
import SwitchScreens from '../BuildComponent.js/SwitchScreens';
import LightBulbAnimation from './LightBulbAnimation';
import { useState, useRef } from 'react';
import DragBlocksAnimation from './DragBlocksAnnimation';
import AssignmentOptionsBar from '../questions/assignmentOptionsBar';


function ExampleExercise({nextSlideHandler, prevSlideHandler, slideCount, setTyping, typing, message, isFocused, title, setSlideCount, slideCountEnd}) {
    const [focused, setFocused] = useState(isFocused && slideCount === 3); 
    const scrollViewRef = useRef(null);
    const extraStyle = {
        marginLeft: 8,
        paddingLeft: 3,
        borderRadius: 10,
    }

    return(
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
                imageStyle={{opacity: slideCount >= 0 ? 0.10 : 0.15}}
                >
                    <AssignmentOptionsBar 
                        slideCount = {slideCount}
                        nextSlideHandler = {nextSlideHandler}
                        prevSlideHandler = {prevSlideHandler}
                        slideCountEnd = {slideCountEnd}
                        setSlideCount = {setSlideCount}
                        text = {{text: 'Uitleg', left: '44%' }}
                    />

                    <ScrollView style = {{flex: 1, marginTop: 0}}
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                    >
                            <DragBlocksAnimation />               
                            <View style = {{marginTop: 15}}>
                                <ChatBoxGPT 
                                answer={message.answer}
                                isLastItem={true}
                                thread_id={message.thread_id}
                                setTyping={setTyping}
                                typing={typing}
                                extraStyle={extraStyle}
                                />
                            </View>

                        </ScrollView>   
                </ImageBackground>
            </LinearGradient>
    )
}

export default ExampleExercise


const styles = StyleSheet.create({
    container: {
        flex: 1, 
    },
    imageBackground: {
        flex: 1, 
        resizeMode: 'contain',
    },
    border: {
        borderBottomColor: `rgba(77, 77, 77, 0.5)`,
        borderBottomWidth: 0.6,
        shadowColor: `rgb(1, 1, 1)`,
        shadowOffset: {height: 1, width: 0},
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 1,
    },
})