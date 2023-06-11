import { useIsFocused, useNavigation } from '@react-navigation/native'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Animated, ImageBackground, Keyboard, ScrollView, StyleSheet, Dimensions, TouchableOpacity, View, Alert } from 'react-native'
import { ColorsBlue, ColorsGray, ColorsGreen } from '../../../constants/palet'
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
import ZeroVelocityPlot from './CustomQuestionContainers/ZeroVelocityPlot'
import AssignmentOptionsBar from './assignmentOptionsBar'
import { deleteMeasurementResult } from '../../../hooks/measurement_results'
import { deletePowerMeasurementResult } from '../../../hooks/power_measurement.hooks'

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
    removeTries,
    questionTitle,
    showZeroVelocityPlot,
    answerHandler
}){
    const isScreenFocused = slideCount - 2 <= index && slideCount >= index

    const chartCtx = useContext(ChartContext);
    const userprofileCtx = useContext(UserProfileContext);

    // Charts
    const opacityInterpolation = useRef(new Animated.Value(1)).current;
    const keyboardHeight = useRef(new Animated.Value(1)).current;
    const imageHeight = useRef(new Animated.Value(chartCtx.trueCount > 1 ? 560 : 340)).current; //Change these values when changing the image size
    const [chartAvailable, setChartAvailable] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const swiperRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    // Animations
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [showMeasurementModal, setShowMeasurementModal] = useState(false);
    const [input, setInput] = useState('');
    const blinkCtx = useContext(BlinkContext);
    
    //user details
    const {school_id, class_id, group_id} = userprofileCtx.userprofile
    const chartLength = chartCtx.finalChartData.length;

    //filter out assignment∂
    const questionData = questions[assignmentNumber - 1]; //Filter for correct subject
    const subject = questionData.subject
    const [close, setClose] = useState(false);
    const [toggleInfoModal, setToggleInfoModal] = useState(false);

    // New color interpolation code to show data button
    useEffect(() => {
        if (slideCount === 6 && isFocused) {
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
    
    const keyboardWillShow = useCallback((event) => {
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
    });
    
    const keyboardWillHide = useCallback((event) => {
        setIsKeyboardOpen(false);
        Animated.parallel([
            Animated.timing(keyboardHeight, {
                duration: event.duration,
                toValue: 0,
                useNativeDriver: false
            }),
            Animated.timing(imageHeight, {
                duration: event.duration,
                toValue: chartCtx.trueCount > 1 ? 570 : 380, //Change these values when changing the image size
                useNativeDriver: false
            }),
        ]).start();
    });
    
    const setCloseHandler = useCallback (() => {
        setClose(!close);
    })
    
    const deleteImageHandler = useCallback(async () => {
        const {recordNumber} = chartCtx.finalChartData[currentIndex];
        console.log('CURRENTCHARTDATA: ', recordNumber);

        // Alert.alert(
        //   'Let Op!',
        //   'Weet je zeker dat je deze meting wilt verwijderen?',
        //   [
        //       {
        //           text: 'No',
        //           onPress: () => {},
        //           style: 'cancel',
        //       },
        //       {
        //           text: 'Yes',
        //           onPress: async () => {
                      try {
                        if (subject === "MOTOR"){
                            if (!recordNumber) {
                              Alert.alert('Produce data before deleting an image');
                              return;
                            }
                            await deleteMeasurementResult(recordNumber)
                              .then(() => {
                                console.log(`deleted image with record_number: ${recordNumber}`);
                                chartCtx.setFinalChartData(
                                  chartCtx.finalChartData.filter(
                                    (data) => data.recordNumber !== recordNumber
                                  )
                                );
                                console.log(`deleted image from local app wide state`);
                                setIsLoading(false);
                              })
                              .catch((error) => {
                                console.log(error);
                                setIsLoading(false);
                              });
                            
                        }

                        if (subject === "CAR"){
                            if (!recordNumber) {
                              Alert.alert('Produce data before deleting an image');
                              return;
                            }
                            await deletePowerMeasurementResult(recordNumber)
                              .then(() => {
                                console.log(`deleted image with record_number: ${recordNumber}`);
                                chartCtx.setFinalChartData(
                                  chartCtx.finalChartData.filter(
                                    (data) => data.recordNumber !== recordNumber
                                  )
                                );
                                console.log(`deleted image from local app wide state`);
                                setIsLoading(false);
                              })
                              .catch((error) => {
                                console.log('failed to delete', error);
                                setIsLoading(false);
                            });
                            
                        }
                      }
                      catch(error) {
                          Alert.alert('Het is niet gelukt om de meting te verwijderen')
                          return
                      }
                //   }
        //         }
        //       ]
        //   )
    }, [subject, chartCtx.finalChartData, currentIndex]);

    const redirectToMeasurementHandler = useCallback((optionsVisible) => {
        
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
    })

    const onMetingPressed = useCallback((index) => {
        swiperRef.current.scrollBy(index - currentIndex, true);
    }, [currentIndex, swiperRef]);

    return(
            <Animated.View style={{flex: 1, marginBottom: keyboardHeight, width: SCREEN_WIDTH}}>

                    <ScrollView style = {{flex: 1}}
                    showsVerticalScrollIndicator={false}>
                        <View style = {{paddingBottom: 20}}>


                                <View> 
                                    <AssignmentOptionsBar
                                        midIconHandler={deleteImageHandler}
                                        text={questionData.tokens}
                                        chartLength={chartLength}
                                        redirectToMeasurementHandler={redirectToMeasurementHandler}
                                        currentIndex={currentIndex}
                                        onMetingPressed={onMetingPressed}
                                        subject={subject}
                                        blinkButton = {blinkCtx.shouldBlinkDataButton}
                                        chartAvailable={chartAvailable}
                                        performedMeasurement={performedMeasurement}
                                        opacityChange={opacityInterpolation.current}
                                        slideCount = {slideCount}
                                        nextSlideHandler = {nextSlideHandler}
                                        prevSlideHandler = {prevSlideHandler}
                                        slideCountEnd = {slideCountEnd}
                                        setSlideCount = {setSlideCount}
                                        slideTotal = {slideTotal}
                                        currentSlidePosition = {currentSlidePosition}
                                        index = {index}
                                    />
                                </View>

                                {index === slideCount - 1 && 
                                <ImageContainer 
                                    imageHeight = {imageHeight}
                                    title = {questionData.title}
                                    assignment_number = {questionData.assignment_number}
                                    keyboardHeight = {keyboardHeight}
                                    subject = {subject}
                                    chartAvailable = {chartAvailable}
                                    setChartAvailable = {setChartAvailable}
                                    checkDataCorrectnessHandler = {checkDataCorrectnessHandler}
                                    performedMeasurement = {performedMeasurement}
                                    slideCount = {slideCount}
                                    isKeyboardOpen = {isKeyboardOpen}
                                    swiperRef = {swiperRef}
                                    currentIndex = {currentIndex}
                                    setCurrentIndex = {setCurrentIndex}
                                    setIsLoading = {setIsLoading}
                                    isLoading = {isLoading}
                            />
                            }
                            { showZeroVelocityPlot &&
                                // show custom plot
                                <ZeroVelocityPlot />
                            }

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
                                index = {index}
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
                                removeTries = {removeTries}
                                questionTitle = {questionTitle}
                                setToggleInfoModal = {setToggleInfoModal}
                                toggleInfoModal = {toggleInfoModal}
                                answerHandler = {answerHandler}
                                />
                                
                                

                                <CustomMeasurementModal 
                                    showMeasurementModal={showMeasurementModal}
                                    setShowMeasurementModal={setShowMeasurementModal}
                                    questionData={questionData}
                                    chartLength={chartLength}
                                    
                                />
                                
                                
                                {chatgptAnswer && 
                                    <ChatGPTQuestionsContainer 
                                        questionData = {questionData}
                                    />
                                }
                            </>
                        }   
                        </View>
                    </ScrollView>  
                    {slideCount === slideTotal - 2 &&
                    <View style = {{position: 'absolute', bottom: '2%', right: '5%'}}>
                        <Icon 
                            icon = "plus-circle"
                            size = {30}
                            color = {ColorsGray.gray200}
                            onPress = {() => setToggleInfoModal(true)}
                            differentDir={true}
                        />
                    </View>
                    }
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