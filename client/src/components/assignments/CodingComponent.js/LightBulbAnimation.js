import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Animated, Easing, StyleSheet } from 'react-native';
import { ColorsBlue } from '../../../constants/palet';
import ChartToggle from '../../robot/driving_on_command/chartToggle';
import ToggleMenu from '../../robot/driving_on_command/ToggleMenu';



function LightBulbAnimation({exercise}) {
    const [isOn, setIsOn] = useState(false);
    const animatedValue = useState(new Animated.Value(0))[0];
    const [toggleMenu, setToggleMenu] = useState();
    const [isCorrect, setIsCorrect] = useState(false);

    const toggleLightBulb = () => {
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
        outputRange: [ColorsBlue.blue100, 'rgb(255, 200, 0)'],
    });

    const shadowOpacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const borderWidth = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 0],
    });

    const containerBackgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(10, 10, 10, 0.2)', 'rgba(255, 200, 0, 0.1)'],
    });

    const extraStyle = {
        marginVertical: 10,
    }


    function toggleChartSettings() {
        setToggleMenu(!toggleMenu);
        if (isCorrect){
            toggleLightBulb()
        }

    }

    return (
        <Animated.View style={[styles.container, {backgroundColor: containerBackgroundColor}]}>
            <TouchableOpacity onPress={toggleLightBulb} style={styles.textContainer}>
            <Animated.View
            style={[
                {
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    borderColor: ColorsBlue.blue1400,
                    borderWidth: borderWidth,
                },
                { backgroundColor },
                {
                    shadowColor: 'rgb(255, 211, 0)',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity,
                    shadowRadius: 30,  
                }
            ]}
            />
                <Text style={styles.text}>{isOn ? 'Uit' : 'Aan'}</Text>
            </TouchableOpacity>
                
        </Animated.View>
    );
}

export default LightBulbAnimation

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 180,
        paddingTop: 5,
        borderColor: `rgba(77, 77, 77, 0.2)`,
        borderWidth: 1,
        borderRadius: 20,
        shadowColor: `rgba(0, 0, 0, 1)`,
        shadowOffset: { height: 3, width: 1 },
        shadowRadius: 3,
        marginHorizontal: 8,
        marginTop: 8,
    },
    textContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: 20,
        fontSize: 20,
        fontWeight: 'bold',
        color: ColorsBlue.blue100,
        textAlign: 'center',
    }
})