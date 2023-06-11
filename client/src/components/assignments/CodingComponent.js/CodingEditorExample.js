import {  ImageBackground, ScrollView, StyleSheet,  View, Dimensions, Animated, Easing } from 'react-native';
import { ColorsBlue, } from '../../../constants/palet';
import ChatBoxGPT from '../../chatgpt/ChatBoxGPT';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useRef } from 'react';
import AssignmentOptionsBar from '../questions/assignmentOptionsBar';
import CodeEditorScreen from '../CodingQuestions/CodeEditorScreen';


const { width: SCREEN_WIDTH } = Dimensions.get('window');


function CodingEditorExample({nextSlideHandler, prevSlideHandler, slideTotal, slideCount, setTyping, typing, message, isFocused, currentSlidePosition, setSlideCount, slideCountEnd, index}) {
    const isScreenFocused = slideCount - 1 === index
    const scrollViewRef = useRef(null);
    const [isOn, setIsOn] = useState(false)
    const animatedValue = useState(new Animated.Value(0))[0];

    const extraStyle = {
        marginLeft: 8,
        paddingLeft: 3,
        borderRadius: 10,
    }
    const [code, setCode] = useState(`if (knop == Aan){
// Voer uit als op Aan wordt gedrukt
    lampAan()
}
else{
// Voer uit als op Uit wordt gedrukt
    lampuit()
}`)


    const toggleLightBulb = () => {
        console.log('toggleLightBulb')
        setIsOn(!isOn);
        
        Animated.timing(animatedValue, {
            toValue: isOn ? 0 : 1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
    };

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [ColorsBlue.blue1200, 'rgb(255, 200, 0)'],
    });

    const containerBackgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(10, 10, 10, 0.2)', 'rgba(255, 200, 0, 0.1)'],
    });

    const shadowOpacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    return(
        <View style = {styles.container} >
                <AssignmentOptionsBar 
                    slideCount = {slideCount}
                    nextSlideHandler = {nextSlideHandler}
                    prevSlideHandler = {prevSlideHandler}
                    slideCountEnd = {slideCountEnd}
                    setSlideCount = {setSlideCount}
                    text = {{text: 'Uitleg', left: '44%' }}
                    slideTotal = {slideTotal}
                    currentSlidePosition = {currentSlidePosition}
                    noPlanet = {true}
                />

                <CodeEditorScreen
                    code={code}
                    setCode={setCode}   
                    section = 'knop'
                    onPressHandler={toggleLightBulb}
                    condition = {isOn}
                    backgroundColor = {backgroundColor}
                    containerBackgroundColor = {containerBackgroundColor}
                    shadowOpacity = {shadowOpacity}
                />
                <ScrollView style = {{flex: 1, marginTop: 0}}
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                >
                        {isScreenFocused && 
                        <>
                        
                            <ChatBoxGPT 
                            answer={message.answer}
                            isLastItem={true}
                            thread_id={message.thread_id}
                            setTyping={setTyping}
                            typing={typing}
                            extraStyle={extraStyle}
                            />
                        </>
                        }
                    </ScrollView>   
        </View>
    )
}

export default CodingEditorExample


const styles = StyleSheet.create({
    container: {
        flex: 1, 
        width: SCREEN_WIDTH,
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