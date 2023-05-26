import { useIsFocused, useNavigation } from '@react-navigation/native'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Animated, ImageBackground, Keyboard, ScrollView, StyleSheet, Dimensions, TouchableOpacity, View, Alert } from 'react-native'
import { ColorsBlue, ColorsGreen } from '../../../constants/palet'
import { ChartContext } from '../../../store/chart-context'
import Icon from '../../Icon'
import ImageContainer from './ImageContainer'
import QuestionContainer from './QuestionContainer'
import { UserProfileContext } from '../../../store/userProfile-context'
import DisplayCircuit from './CustomContainersProject2/DisplayCircuit'
import CarAnimation from './CustomCarAnimationContainer/CarAnimation'
import CustomMeasurementModal from '../../UI/CustomMeasurementModal'
import { BlinkContext } from '../../../store/animation-context'
import ChatGPTQuestionsContainer from './CustomQuestionContainers/ChatGPTQuestionsContainer'



const { width: SCREEN_WIDTH } = Dimensions.get('window');
function Questions({ 
    currentSlidePosition, 
    questions, 
    assignmentNumber, 
    isFocused, 
    setSlideCount, 
    slideCount, 
    prevSlideHandler, 
    nextSlideHandler, 
    slideCountEnd, 
    checkDataCorrectnessHandler, 
    normal_and_multiple_choice,
    generate_answer,
    performedMeasurement,
    CustomContainer,
    answersStudent,
    showCarAnimation,
    index,
    chatgptAnswer,
    currentExerciseLesson,
    slideTotal,
}){
    const isScreenFocused = slideCount - 2 <= index && slideCount >= index

    const chartCtx = useContext(ChartContext);
    const userprofileCtx = useContext(UserProfileContext);


    const opacityInterpolation = useRef(new Animated.Value(1)).current;
    const keyboardHeight = useRef(new Animated.Value(1)).current;
    const imageHeight = useRef(new Animated.Value(chartCtx.trueCount > 1 ? 560 : 340)).current; //Change these values when changing the image size
    
    const [chartAvailable, setChartAvailable] = useState(false);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [showMeasurementModal, setShowMeasurementModal] = useState(false);
    const [input, setInput] = useState('');
    const blinkCtx = useContext(BlinkContext);

    
    //user details
    const {school_id, class_id, group_id} = userprofileCtx.userprofile
    const chartLength = chartCtx.finalChartData.length;
    
    //filter out assignment∂
    const questionData = questions[assignmentNumber - 1]; //Filter for correct subject
    
    const [close, setClose] = useState(false);


    // New color interpolation code to show data button
    useEffect(() => {
        if (slideCount === 5 && isFocused) {
            blinkCtx.setShouldBlinkDataButton(true)
            opacityInterpolation.current = blinkCtx.colorAnimation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [1, 0, 1],
            });
        } 
        else {
            blinkCtx.setShouldBlinkDataButton(false)
        }
    }, [isFocused, slideCount]);
    
    useEffect(() => {
        const keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', keyboardWillShow);
        const keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', keyboardWillHide);
        
        return () => {
            keyboardWillShowSub.remove();
            keyboardWillHideSub.remove();
        }
    }, [isFocused, chartCtx.trueCount]);
    
    useEffect(() => {
        Animated.timing(imageHeight, {
            duration: 250, // You can adjust the duration as needed
            toValue: (chartCtx.trueCount > 1 && !isKeyboardOpen) ? 560 : 360,
            useNativeDriver: false,
        }).start();
    }, [isFocused, chartCtx.trueCount]);
    
    const keyboardWillShow = (event) => {
        setIsKeyboardOpen(true);
        Animated.parallel([
            Animated.timing(keyboardHeight, {
                duration: event.duration,
                toValue: event.endCoordinates.height, 
                useNativeDriver: false
            }),
            Animated.timing(imageHeight, {
                duration: event.duration,
                toValue: 5,
                useNativeDriver: false
            }),
        ]).start();
    };
    
    const keyboardWillHide = (event) => {
        setIsKeyboardOpen(false);
        Animated.parallel([
            Animated.timing(keyboardHeight, {
                duration: event.duration,
                toValue: 0,
                useNativeDriver: false
            }),
            Animated.timing(imageHeight, {
                duration: event.duration,
                toValue: chartCtx.trueCount > 1 ? 560 : 360, //Change these values when changing the image size
                useNativeDriver: false
            }),
        ]).start();
    };
    
    function setCloseHandler(){
        setClose(!close);
    }
    
    function redirectToMeasurementHandler(optionsVisible){
        
        console.log('clicked')
        if (!school_id || !class_id || !group_id){
            Alert.alert('Voeg een klas en/of group toe om verder te gaan');
            return;
        }
        if (chartLength >= 8){
            Alert.alert('Je hebt het maximaal aantal metingen bereikt, verwijder oudere metingen om verder te gaan');
            return;
        }
        if (optionsVisible){
            optionsVisible(false);
        }
        setShowMeasurementModal(true);
    }

    return(
            <Animated.View style={{flex: 1, marginBottom: keyboardHeight, width: SCREEN_WIDTH,}}>

                    <ScrollView style = {{flex: 1}}
                    showsVerticalScrollIndicator={false}>
                
                                <ImageContainer 
                                assignment_number={questionData.assignment_number}
                                tokens={questionData.tokens}
                                title={questionData.title}
                                subject={questionData.subject}
                                imageHeight={imageHeight}
                                keyboardHeight={keyboardHeight}
                                setChartAvailable={setChartAvailable}
                                chartAvailable={chartAvailable}
                                redirectToMeasurementHandler={redirectToMeasurementHandler}
                                checkDataCorrectnessHandler={checkDataCorrectnessHandler}  
                                blinkButton = {blinkCtx.shouldBlinkDataButton}
                                performedMeasurement={performedMeasurement}
                                opacityChange = {opacityInterpolation.current}
                                slideCount = {slideCount}
                                nextSlideHandler = {nextSlideHandler}
                                prevSlideHandler = {prevSlideHandler}
                                slideCountEnd = {slideCountEnd}
                                setSlideCount = {setSlideCount}
                                slideTotal = {slideTotal}
                                currentSlidePosition = {currentSlidePosition}
                                isKeyboardOpen = {isKeyboardOpen}
                            />
                            


                            { 
                            isScreenFocused && 
                            <>
                            
                            {questionData.subject === 'LED' && 
                            <DisplayCircuit 
                                input = {input}
                                assignment_number={questionData.assignment_number}
                                isFocused={isFocused}
                                keyboardHeight={keyboardHeight}
                            />}

                            {showCarAnimation && 
                            <CarAnimation 
                                input = {input}
                                assignment_number={questionData.assignment_number}
                                isFocused={isFocused}
                                keyboardHeight={keyboardHeight}
                                
                            />
                            }
                                {close &&
                                    <View style = {styles.compress}>
                                        <Icon
                                        size = {30 }
                                        color = {ColorsBlue.blue200}
                                        icon="lock-open-outline"
                                        onPress={setCloseHandler}/>
                                    </View> 
                                }

                                <QuestionContainer 
                                questionData={questionData}
                                assignmentNumber={assignmentNumber}
                                slideCount = {slideCount} 
                                prevSlideHandler = {prevSlideHandler}
                                nextSlideHandler = {nextSlideHandler}
                                slideCountEnd = {slideCountEnd}
                                normal_and_multiple_choice = {normal_and_multiple_choice}
                                generate_answer = {generate_answer}
                                performedMeasurement = {performedMeasurement}
                                CustomContainer = {CustomContainer}
                                answersStudent = {answersStudent}
                                input = {input}
                                setInput = {setInput}
                                currentExerciseLesson = {currentExerciseLesson}
                                chatgptAnswer = {chatgptAnswer}
                                chartAvailable = {chartAvailable}
                                />
                                
                                

                                <CustomMeasurementModal 
                                    showMeasurementModal={showMeasurementModal}
                                    setShowMeasurementModal={setShowMeasurementModal}
                                    questionData={questionData}
                                    chartLength={chartLength}
                                    
                                />
                                
                                {chatgptAnswer && 
                                    <ChatGPTQuestionsContainer />
                                }
                            </>
                        }   
                    </ScrollView>  
            </Animated.View>
)
}

export default React.memo(Questions)


const styles = StyleSheet.create({ 
    container: {
        flex: 1, 
        width: SCREEN_WIDTH,
    },
    compress: {
        position: 'absolute',
        top: "102%",
        left: 10,
    },
    button: {
        height: 60,
        justifyContent: 'center',
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: `rgba(77, 77, 77, 0.5)`,
        shadowColor: `rgba(11, 11, 11)`,
        shadowOffset: {height: 1, width: 0},
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 5,
        marginBottom: 6,
        backgroundColor: 'rgba(5, 5, 30, 0.6)',
    },
    text: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },

})