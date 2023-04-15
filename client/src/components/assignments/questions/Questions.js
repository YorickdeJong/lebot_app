import { useIsFocused, useNavigation } from '@react-navigation/native'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Animated, ImageBackground, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import { ColorsBlue } from '../../../constants/palet'
import { AssignmentContext } from '../../../store/assignment-context'
import { ChartContext } from '../../../store/chart-context'
import { SocketContext } from '../../../store/socket-context'
import Icon from '../../Icon'
import TextDisplay from '../BuildComponent.js/TextDisplay'
import ImageContainer from './ImageContainer'
import QuestionContainer from './QuestionContainer'
import { ipAddressRaspberryPi } from '../../../data/ipaddresses.data'



function Questions({title, description, questions, assignmentNumber, isFocused, setSlideCount}){
    const chartCtx = useContext(ChartContext);
    const socketCtx = useContext(SocketContext);
    const assignmentCtx = useContext(AssignmentContext);
    const navigation = useNavigation(); 
    const keyboardHeight = useRef(new Animated.Value(0)).current;
    const imageHeight = useRef(new Animated.Value(chartCtx.trueCount > 1 ? 480 : 320)).current; //Change these values when changing the image size
    const [chartAvailable, setChartAvailable] = useState(false);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);


    //filter out assignment∂
    const questionData = questions[assignmentNumber - 1]; //Filter for correct subject

    //check if screen is focused
    const isFocussedDiffScreen = useIsFocused()
    const [close, setClose] = useState(false);

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
            toValue: (chartCtx.trueCount > 1 && !isKeyboardOpen) ? 480 : 320,
            useNativeDriver: false,
        }).start();
    }, [isFocused, chartCtx.trueCount]);
    
    const keyboardWillShow = (event) => {
        setIsKeyboardOpen(true);
        Animated.parallel([
        Animated.timing(keyboardHeight, {
            duration: event.duration,
            toValue: 0, 
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
            toValue: chartCtx.trueCount > 1 ? 480 : 320, //Change these values when changing the image size
            useNativeDriver: false
        }),
        ]).start();
    };
    
    function setCloseHandler(){
        setClose(!close);
    }

    function redirectToMeasurementHandler(){
        if (chartCtx.chartData.length >= 8){
            Alert.alert('You have reached the maximum number of images for this assignment, delete image to continue');
            return
        }
        const config = { //TODO make these values statewide
                host: ipAddressRaspberryPi,
                port: 22,
                username: "ubuntu",
                password: "password",
        }
        if (!socketCtx.isConnected)
        socketCtx.Connect(config); //set assignment number and title
        assignmentCtx.setTitleImageHandler(questionData.title);
        assignmentCtx.setAssignmentImageHandler(questionData.assignment_number);
        assignmentCtx.setSubjectImageHandler(questionData.subject);
        navigation.navigate('Assignments', 
                    { screen: 'Controller',    
                      params: {
                          displayNumber: 1,
                      },
        }) 
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
                {flex: 1,}
                }
                imageStyle={{opacity: 0.10}}
                >
                    <ScrollView style = {{flex: 1}}
                    showsVerticalScrollIndicator={false}>
                            {isFocused && isFocussedDiffScreen && <ImageContainer 
                            assignment_number={questionData.assignment_number}
                            tokens={questionData.tokens}
                            title={questionData.title}
                            subject={questionData.subject}
                            imageHeight={imageHeight}
                            keyboardHeight={keyboardHeight}
                            setChartAvailable={setChartAvailable}
                            chartAvailable={chartAvailable}
                            redirectToMeasurementHandler={redirectToMeasurementHandler}
                            />}
                           
                            {!close ? 
                            <>
                            <View style = {styles.descriptionContainer}>
                                <TextDisplay
                                title = {title}
                                description= {description}
                                showIcon
                                differentIcon="home-outline"
                                iconSize={30}
                                setCloseHandler={() => setSlideCount(0)}
                                />
                            </View>
                            </>: 
                            <View style = {styles.compress}>
                                <Icon
                                size = {30 }
                                color = {ColorsBlue.blue200}
                                icon="lock-open-outline"
                                onPress={setCloseHandler}/>
                            </View> }
                            <QuestionContainer 
                            questionData={questionData}
                            assignmentNumber={assignmentNumber}
                            />
                            
                            
                            {!chartAvailable && <BlurView style = {styles.button } intensity = {7}>
                                <TouchableOpacity
                                onPress = {redirectToMeasurementHandler}>
                                    <Text style = {styles.text}>Druk hier om data te verzamelen</Text>
                                </TouchableOpacity>
                            </BlurView>}
                    </ScrollView>  
            </ImageBackground>
        </LinearGradient>
    )
}

export default React.memo(Questions)


const styles = StyleSheet.create({
    container: {
        flex: 1, 
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
        marginBottom: 6
    },
    text: {
        color: ColorsBlue.blue200,
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    descriptionContainer: {
        // marginVertical: 8,
        marginTop: 8,
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: `rgba(77, 77, 77, 0.5)`,
        shadowColor: `rgba(11, 11, 11)`,
        shadowOffset: {height: 1, width: 0},
        shadowOpacity: 1,
        shadowRadius: 3,
    }
})