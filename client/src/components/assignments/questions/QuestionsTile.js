import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState, useRef, useContext} from "react";
import { ImageBackground,  StyleSheet, Animated, Keyboard, View, Alert} from "react-native";
import { ScrollView} from "react-native-gesture-handler";

import { ColorsBlue, ColorsDarkestBlue, ColorsTile } from "../../../constants/palet";
import { AssignmentContext } from "../../../store/assignment-context";
import { ChartContext } from "../../../store/chart-context";
import { SocketContext } from "../../../store/socket-context";
import PressableButton from "../../robot/robot_commands/PressableButton";
import ImageContainer from "./ImageContainer";
import QuestionContainer from "./QuestionContainer";



function QuestionsTile({assignmentNumber, assignmentTopic}) {
    const chartCtx = useContext(ChartContext)
    const socketCtx = useContext(SocketContext);
    const assignmentCtx = useContext(AssignmentContext);
    const navigation = useNavigation();     
    const keyboardHeight = useRef(new Animated.Value(0)).current;
    const imageHeight = useRef(new Animated.Value(450)).current; //Change these values when changing the image size
    const questionData = assignmentTopic[assignmentNumber - 1];

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
            toValue: 450, //Change these values when changing the image size
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
        socketCtx.Connect(config); //set assignment number and title
        assignmentCtx.setTitleImageHandler(questionData.title);
        assignmentCtx.setAssignmentImageHandler(questionData.assignment_number);
        navigation.navigate('Controller')
    }

    const extraStyle = {
        marginHorizontal: 3, 
        marginVertical: 5,
    }

    return (
        <LinearGradient
            colors={[ColorsBlue.blue1300, ColorsBlue.blue1300, ColorsBlue.blue1300]}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <ImageBackground
                source={require('./../../../../assets/chatbackground.png')} 
                style={
                {flex: 1, resizeMode: 'contain'}
                }
                imageStyle={{opacity: 0.15}}
            >
                <BlurView intensity={5} style = {styles.blurView}>
                        <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}                 
                        >
                        <View style = {{chartflex: 1}}>
                        <ImageContainer 
                            imageHeight={imageHeight}
                            title={questionData.title}
                            assignment_number = {questionData.assignment_number}
                            tokens = {questionData.currency}
                            keyboardHeight={keyboardHeight}
                        />
                            <QuestionContainer
                                questionData={questionData}
                                redirectToMeasurementHandler={redirectToMeasurementHandler}
                            />
                        </View>
                        <PressableButton 
                        text="Press to Produce Data"
                        onPress={redirectToMeasurementHandler}
                        extraStyles = {extraStyle}
                        />
                        {/* TODO: ADD chat instructions with produce data button */}
                    </ScrollView>
               </BlurView>
            </ImageBackground>
        </LinearGradient>
    )
}

export default React.memo(QuestionsTile)

const styles = StyleSheet.create({
    blurView: {
        flex: 1 
    },
})