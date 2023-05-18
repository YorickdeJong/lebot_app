import {  ImageBackground, ScrollView, StyleSheet,  View } from 'react-native';
import { ColorsBlue, } from '../../../constants/palet';
import ChatBoxGPT from '../../chatgpt/ChatBoxGPT';
import { LinearGradient } from 'expo-linear-gradient';
import TextDisplay from '../BuildComponent.js/TextDisplay';
import SwitchScreens from '../BuildComponent.js/SwitchScreens';
import LightBulbAnimation from './LightBulbAnimation';
import { useContext, useEffect, useLayoutEffect, useState, useRef } from 'react';
import { BlinkContext } from '../../../store/animation-context';
import AssignmentOptionsBar from '../questions/assignmentOptionsBar';


function CodingExample({nextSlideHandler, prevSlideHandler, slideCount, setTyping, typing, message, slideCountEnd, setSlideCount, title}){
    const description = "Dit is een beschrijving van het onderwerp. Hier leren we heel veel dingen over batterijen en kabels en over hoe we ze moeten aansluiten."

    const scrollViewRef = useRef(null);
    
    const extraStyle = {
        marginLeft: 8,
        paddingLeft: 3,
        borderRadius: 10,
    }



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
                imageStyle={{opacity: 0.05}}
                >
                    <AssignmentOptionsBar 
                        slideCount = {slideCount}
                        nextSlideHandler = {nextSlideHandler}
                        prevSlideHandler = {prevSlideHandler}
                        slideCountEnd = {slideCountEnd}
                        setSlideCount = {setSlideCount}
                        text = {{text: 'Uitleg', left: '44%' }}
                    />

                    <LightBulbAnimation />

                    <TextDisplay 
                    title={title}
                    description={description}/>

                    <ScrollView 
                    style = {{flex: 1, marginTop: 12}}
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                    >
                            <ChatBoxGPT 
                            answer={message.answer}
                            isLastItem={true}
                            thread_id={message.thread_id}
                            setTyping={setTyping}
                            typing={typing}
                            extraStyle={extraStyle}
                            />
                </ScrollView>   
            </ImageBackground>
        </LinearGradient>
    )
}

export default CodingExample;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
    },
    imageBackground: {
        flex: 1, 
        resizeMode: 'contain',
    },
    border: {
        borderBottomColor: `rgba(33, 33, 33, 0.5)`,
        borderBottomWidth: 0.6,
    },
    textContainer: {
        backgroundColor: 'rgba(0, 0, 20, 0.75)',
    }
})