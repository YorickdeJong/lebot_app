import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, ScrollView, Dimensions, Animated } from 'react-native';
import { useFonts } from 'expo-font';
import LandingPageOne from './PageOne';
import LandingPageTwo from './PageTwo';
import LandingPageThree from './PageThree';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate={0}
          snapToInterval={screenHeight}
          snapToAlignment="center"
        >
          <View style={[styles.container, { width: screenWidth , height: screenHeight}]}>
            <LandingPageOne blinkOpacity={blinkOpacity} />
          </View>

          <View style={[styles.container, { width: screenWidth, height: screenHeight }]}>
            <LandingPageTwo blinkOpacity={blinkOpacity} />
          </View>

          <View style={[styles.container, { width: screenWidth, height: screenHeight }]}>
            <LandingPageThree blinkOpacity={blinkOpacity} />
          </View>
        </ScrollView>
      );
    };
    
const styles = StyleSheet.create({
      backgroundPattern: {
        flex: 1,
      },
      container: {
        width: '100%',
      },
});

export default Begin;
