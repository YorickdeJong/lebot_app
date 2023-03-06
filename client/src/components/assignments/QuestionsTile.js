import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState, useRef} from "react";
import { ImageBackground,  StyleSheet, Animated, Keyboard} from "react-native";
import { ScrollView} from "react-native-gesture-handler";

import { ColorsDarkestBlue, ColorsTile } from "../../constants/palet";
import ImageContainer from "./ImageContainer";
import QuestionContainer from "./QuestionContainer";



function QuestionsTile({assignmentNumber, assignmentTopic}) {


    const keyboardHeight = useRef(new Animated.Value(0)).current;
    const imageHeight = useRef(new Animated.Value(300)).current;
    const questionData = assignmentTopic[assignmentNumber - 1];

    keyboardWillShow = (event) => {
        Animated.parallel([
        Animated.timing(keyboardHeight, {
            duration: event.duration,
            toValue: event.endCoordinates.height / 1.3,
            useNativeDriver: false
        }),
        Animated.timing(imageHeight, {
            duration: event.duration,
            toValue: 40,
            useNativeDriver: false
        }),
        ]).start();
    };

    keyboardWillHide = (event) => {
        Animated.parallel([
        Animated.timing(keyboardHeight, {
            duration: event.duration,
            toValue: 0,
            useNativeDriver: false
        }),
        Animated.timing(imageHeight, {
            duration: event.duration,
            toValue: 300,
            useNativeDriver: false
        }),
        ]).start();
    };
    
    useEffect(() => {
        const keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', keyboardWillShow);
        const keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', keyboardWillHide);

        return () => {
            keyboardWillShowSub.remove();
            keyboardWillHideSub.remove();
        }
    }, []);
  

  


    return (
        <LinearGradient
            colors={[ColorsDarkestBlue.blue1000, ColorsDarkestBlue.blue700, ColorsDarkestBlue.blue1000]}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <ImageBackground
                source={require('./../../../assets/carBluePrint2.jpg')} 
                style={
                {flex: 1, resizeMode: 'contain'}
                }
                imageStyle={{opacity: 0.13}}
            >
                <BlurView intensity={2} >
                    <ScrollView
                    showsVerticalScrollIndicator={false}
                    style = {styles.scrollView}
                    contentContainerStyle={{ flexGrow: 1 }}
                    >
                        <Animated.View style={[styles.container, { marginBottom: keyboardHeight}]}>
                                <ImageContainer 
                                    imageHeight={imageHeight}
                                    title={questionData.title}
                                    assignment_number = {questionData.assignment_number}
                                    tokens = {questionData.currency}
                                />
                                <QuestionContainer
                                    questionData={questionData}
                                />
                        </Animated.View>
                    </ScrollView>
               </BlurView>
            </ImageBackground>
        </LinearGradient>
    )
}

export default QuestionsTile

const styles = StyleSheet.create({
    scrollView: {
        marginHorizontal: 10,
        marginBottom: 10,
        marginTop: 10, 
        borderWidth: "0.4%",
        borderColor: ColorsTile.blue400,
        borderRadius: 5,
        backgroundColor: 'rgba(20, 10, 20, 0.25)', 
    },
    container: {
    }
})