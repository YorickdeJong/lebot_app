import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, FlatList, Dimensions, Animated } from 'react-native';
import { useFonts } from 'expo-font';
import LandingPageOne from './PageOne';
import LandingPageTwo from './PageTwo';
import LandingPageThree from './PageThree';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { StatusBar } from 'react-native';

const statusBarHeight = StatusBar.currentHeight;
const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

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
            blinkOpacity.setValue(1); // reset the Animated.Value
        };
    }, []);

    if (!loaded) {
        return null; // You can also show a loading indicator here while the font is being loaded
    }

    const data = [
        { key: '1', Component: LandingPageOne },
        { key: '2', Component: LandingPageTwo },
        { key: '3', Component: LandingPageThree },
    ];

    const renderItem = ({ item }) => {
        const { Component } = item;
        return (
          <View style={{ height: screenHeight}}>
              <Component blinkOpacity={blinkOpacity} />
          </View>
        );
    };

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={screenHeight}
            decelerationRate="fast"
            snapToAlignment="center"
            keyExtractor={item => item.key}
        />
    );
};

const styles = StyleSheet.create({
    backgroundPattern: {
    },
});

export default Begin;