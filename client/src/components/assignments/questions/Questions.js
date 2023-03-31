import { useIsFocused, useNavigation } from '@react-navigation/native'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Animated, ImageBackground, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ColorsBlue } from '../../../constants/palet'
import { AssignmentContext } from '../../../store/assignment-context'
import { ChartContext } from '../../../store/chart-context'
import { SocketContext } from '../../../store/socket-context'
import ChatBoxGPT from '../../chatgpt/ChatBoxGPT'
import Icon from '../../Icon'
import ChartDisplay from '../../robot/driving_on_command/chartDisplay'
import SwitchScreens from '../BuildComponent.js/SwitchScreens'
import TextDisplay from '../BuildComponent.js/TextDisplay'
import ImageContainer from './ImageContainer'
import QuestionContainer from './QuestionContainer'



function Questions({title, description, assignmentNumber, assignmentTopic, question, isFocused}){
    const chartCtx = useContext(ChartContext);
    const socketCtx = useContext(SocketContext);
    const assignmentCtx = useContext(AssignmentContext);
    const navigation = useNavigation(); 
    const keyboardHeight = useRef(new Animated.Value(0)).current;
    const imageHeight = useRef(new Animated.Value(480)).current; //Change these values when changing the image size
    const questionData = assignmentTopic[assignmentNumber - 1];
    const isFocussedDiffScreen = useIsFocused()
    const [close, setClose] = useState(false);

    useEffect(() => {
        const keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', keyboardWillShow);
        const keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', keyboardWillHide);

        return () => {
            keyboardWillShowSub.remove();
            keyboardWillHideSub.remove();
        }
    }, []);

    
    const keyboardWillShow = (event) => {
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

    const keyboardWillHide = (event) => {
        Animated.parallel([
        Animated.timing(keyboardHeight, {
            duration: event.duration,
            toValue: 0,
            useNativeDriver: false
        }),
        Animated.timing(imageHeight, {
            duration: event.duration,
            toValue: 480, //Change these values when changing the image size
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
                host: "10.7.191.113",
                port: 22,
                username: "ubuntu",
                password: "password",
        }
        if (!socketCtx.isConnected)
        socketCtx.Connect(config); //set assignment number and title
        assignmentCtx.setTitleImageHandler(questionData.title);
        assignmentCtx.setAssignmentImageHandler(questionData.assignment_number);
        navigation.navigate('Robot', 
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
                {flex: 1, borderTopColor: ColorsBlue.blue900, borderTopWidth: 0.8,}
                }
                imageStyle={{opacity: 0.10}}
                >
                    <ScrollView style = {{flex: 1}}
                    showsVerticalScrollIndicator={false}>
                            {isFocused && isFocussedDiffScreen && <ImageContainer 
                            assignment_number={questionData.assignment_number}
                            tokens={questionData.tokens}
                            title={questionData.title}
                            imageHeight={imageHeight}
                            keyboardHeight={keyboardHeight}
                            isFocused2={isFocused}
                            />}
                            {!close ? 
                            <>
                            <View style = {{backgroundColor: `rgba(11,11,44,0.3)`}}>
                                <TextDisplay
                                title = {title}
                                description= {description}
                                showIcon
                                setCloseHandler={setCloseHandler}
                                />
                            </View>
                            <QuestionContainer 
                            questionData={questionData}
                            question={question}
                            />
                            </>: 
                            <View style = {styles.compress}>
                                <Icon
                                size = {30 }
                                color = {ColorsBlue.blue200}
                                icon="lock-open-outline"
                                onPress={setCloseHandler}/>
                            </View> }
                            <BlurView style = {styles.button} intensity = {7}>
                                <TouchableOpacity
                                onPress = {redirectToMeasurementHandler}>
                                    <Text style = {styles.text}>Druk hier om data te verzamelen</Text>
                                </TouchableOpacity>
                            </BlurView>
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
    },
    text: {
        color: ColorsBlue.blue200,
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    }
})