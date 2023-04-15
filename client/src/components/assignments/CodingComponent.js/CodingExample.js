import {  ImageBackground, ScrollView, StyleSheet,  View } from 'react-native';
import { ColorsBlue, } from '../../../constants/palet';
import ChatBoxGPT from '../../chatgpt/ChatBoxGPT';
import { LinearGradient } from 'expo-linear-gradient';
import TextDisplay from '../BuildComponent.js/TextDisplay';
import SwitchScreens from '../BuildComponent.js/SwitchScreens';
import LightBulbAnimation from './LightBulbAnimation';
import { useContext, useEffect, useLayoutEffect, useState, useRef } from 'react';
import { BlinkContext } from '../../../store/animation-context';


function CodingExample({nextSlideHandler, prevSlideHandler, slideCount, setTyping, typing, message, isFocused, title}){
    const description = "Dit is een beschrijving van het onderwerp. Hier leren we heel veel dingen over batterijen en kabels en over hoe we ze moeten aansluiten."
    const blinkCtx = useContext(BlinkContext);
    const [focused, setFocused] = useState(isFocused && slideCount === 1); 
    const scrollViewRef = useRef(null);
    
    const extraStyle = {
        marginLeft: 8,
        paddingLeft: 3,
        borderRadius: 10,
    }

    useLayoutEffect(() => {
        if (focused) {
        const timer = setTimeout(() => {
            blinkCtx.setShouldBlink(true);
            setTimeout(() => {
            console.log(`blinking: ${blinkCtx.shouldBlink}`)
            blinkCtx.setShouldBlink(false);
            }, 7000);
        }, 10500);

        return () => {
            clearTimeout(timer);
            setFocused(false);
        }
        }
    }, [focused]);

    return (
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
                <LightBulbAnimation />
                    <View style={styles.border}/>
                    <TextDisplay 
                    title={title}
                    description={description}/>
                    
                    <ScrollView 
                    style = {{flex: 1}}
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                    >
                                <View style={{ alignItems: 'flex-start', marginLeft: 10, paddingTop: 10 }}>
                                    <ChatBoxGPT 
                                    answer={message.answer}
                                    isLastItem={true}
                                    thread_id={message.thread_id}
                                    setTyping={setTyping}
                                    typing={typing}
                                    extraStyle={extraStyle}
                                    />
                                </View>
                                    {!typing && (
                                        <SwitchScreens 
                                        prevSlideHandler={prevSlideHandler}
                                        nextSlideHandler={nextSlideHandler}
                                        slideCount={slideCount}
                                        />
                                    )}
                        </ScrollView>   
                </ImageBackground>
            </LinearGradient>
    )
}

export default CodingExample;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        paddingBottom: 5
    },
    imageBackground: {
        flex: 1, 
        resizeMode: 'contain',
    },
    border: {
        borderBottomColor: `rgba(77, 77, 77, 0.5)`,
        borderBottomWidth: 0.6,
    },
})