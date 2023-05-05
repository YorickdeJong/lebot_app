import React, { useState, useEffect } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Image
} from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop, Text as SvgText, AnimatedCircle, } from 'react-native-svg';
import { ColorsBlue } from '../../../constants/palet';
import { planetColors } from '../../../data/AssignmentData';
import { useSharedValue, withRepeat, withTiming, useAnimatedStyle, Easing as EasingReanimated, interpolate, Extrapolate } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

const Planets = ({ tileNumber, size, x, y, onPress }) => {
    const animationProgress = useSharedValue(0);
      
    useEffect(() => {
        if (tileNumber === 1) {
        animationProgress.value = withRepeat(
            withTiming(1, { duration: 2500, easing: EasingReanimated.linear }),
            -1,
            true
        );
    
        const interval = setInterval(() => {
            // console.log(JSON.stringify(glowAnimation))
        }, 1000);
        
        return () => {
            clearInterval(interval);
        };
        }
    }, [tileNumber, animationProgress]);
    
    const glowAnimation = useAnimatedStyle(() => {
        const shadowOpacity = interpolate(animationProgress.value, [0, 0.25, 0.5], [0.5, 0.25, 0], Extrapolate.CLAMP);
        // console.log(`rgba(255, 255, 0, ${shadowOpacity})`)
        
        return {
            backgroundColor: `rgba(255, 153, 51, ${shadowOpacity})`,
        };
        });

    return (
      <View style={{ left: x, top: y, position: "absolute" }}>
        <Pressable onPress={() => onPress(tileNumber)} style={({ pressed }) => pressed && styles.pressed}>
            {tileNumber === 1 && (
            <Animated.View
                style={[{
                position: 'absolute',
                zIndex: 1,
                width: size,
                height: size ,
                borderRadius: size  / 2,
                overflow: 'hidden',
                }]}
            >
                    <Animated.View
                    style={[
                        {
                        width: '100%',
                        height: '100%',
                        },
                        glowAnimation,
                    ]}
                    />
            </Animated.View>
            )}
          <Svg width={size} height={size}>
            {/* devs creates planet like shadow */}
            <Defs>
                <RadialGradient id="planetGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <Stop offset="0%" stopColor={planetColors[0][tileNumber - 1]} />
                        <Stop offset="100%" stopColor={planetColors[1][tileNumber - 1]} />
                </RadialGradient>
            </Defs>
            <Defs>
                <RadialGradient id="planetShadow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <Stop offset="96%" stopColor="#000" stopOpacity="0" />
                    <Stop offset="100%" stopColor="#000" stopOpacity="0.5" />
                </RadialGradient>
            </Defs>
            {/* Additional circle for sun-like glow */}
            <Circle
                cx={size / 2}
                cy={size / 2}
                r={size / 2 }
                fill="url(#planetGradient)"
            />
            {/* implements devs on the circle */}
            <Image  
                source={require('../../../../assets/planets/jupiter.jpg')}
                style={{ width: size, height: size, borderRadius: size, opacity: 0.1}}
                imageStyle={{opacity: 0.10}}
                resizeMode="cover"
            />
            <Circle
                cx={size / 2}
                cy={size / 2}
                r={size / 2}
                fill="url(#planetShadow)"
            />
          </Svg>
          <Svg width={size} height={size } style={{ position: "absolute", zIndex: 1 }}>
            <SvgText x={size / 2} y={size / 2} textAnchor="middle" dy=".3em" fontSize={size / 2} fontWeight="bold" fill={ColorsBlue.blue50}>
              {tileNumber}
            </SvgText>
          </Svg>
        </Pressable>
      </View>
    );
};

export default Planets;

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 0.6,
        borderTopColor: ColorsBlue.blue900,
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        paddingTop: 20,
    },
    pressed: {
        opacity: 0.3,
    },
    tile: {
        backgroundColor: ColorsBlue.blue1300,
    }
});
