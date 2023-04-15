import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, ScrollView, Dimensions, Animated } from 'react-native';
import { ColorsBlue, ColorsGray } from '../../constants/palet';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
import Icon from '../../components/Icon';
import LandingPageOne from './PageOne';
import LandingPageTwo from './PageTwo';
import LandingPageThree from './PageThree';

function Begin() {
    const [blinkOpacity] = useState(new Animated.Value(1));
    const [loaded] = useFonts({
        Ubuntu: require('./../../../assets/fonts/Ubuntu-Regular.ttf'),
    });

    useEffect(() => {
        // changes opacity value to 0 in 500 ms and afterwards to 1 in 500 ms
        const blinkAnimation = Animated.sequence([
            Animated.timing(blinkOpacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(blinkOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]);

        const loopAnimation = Animated.loop(blinkAnimation);
        loopAnimation.start();

        //set time out for the animation to run for 5 seconds
        const timeoutId = setTimeout(() => {
            loopAnimation.stop();
            Animated.timing(blinkOpacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }, 5000);

        return () => {
            clearTimeout(timeoutId);
            loopAnimation.stop();
        };
    }, []);

    if (!loaded) {
        return null; // You can also show a loading indicator here while the font is being loaded
    }

    return (
        <ScrollView 
        style={styles.backgroundPattern}
        showsVerticalScrollIndicator={false}
        pagingEnabled={true}
        >
        <View style={styles.container}>

            <LandingPageOne 
                blinkOpacity={blinkOpacity}
            />

            <LandingPageTwo 
                blinkOpacity={blinkOpacity}
            />

            <LandingPageThree 
                blinkOpacity={blinkOpacity}
            />
        </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    backgroundPattern: {
        flex: 1,
        backgroundColor: ColorsBlue.blue1300,
    },
    container: {
        width: "100%",
    }
});

export default Begin;
