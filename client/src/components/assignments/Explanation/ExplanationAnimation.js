

import {View, StyleSheet, Image, ImageBackground, Animated} from 'react-native'
import { ColorsBlue, ColorsGray } from '../../../constants/palet'
import { useEffect, useRef, useState } from 'react';
import Icon from '../../Icon';
import { LinearGradient } from 'expo-linear-gradient';



function ExplanationAnimation() {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [animationActive, setAnimationActive] = useState(false);
    const [animation, setAnimation] = useState(null);
  
    useEffect(() => {
      if (!animationActive) {
        const newAnimation = Animated.loop(
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 5000,
            useNativeDriver: false,
          })
        );
        newAnimation.start();
        setAnimation(newAnimation);
      } else {
        if (animation) {
          animation.stop();
        }
      }
    }, [animatedValue, animationActive]);
  
    const opacityI = animatedValue.interpolate({
      inputRange: [0, 0.33, 0.66, 1],
      outputRange: [0, 1, 1, 1],
    });
  
    const opacityV = animatedValue.interpolate({
      inputRange: [0, 0.33, 0.66, 1],
      outputRange: [0, 0, 1, 1],
    });
  
    const opacityR = animatedValue.interpolate({
      inputRange: [0, 0.33, 0.66, 1],
      outputRange: [0, 0, 0, 1],
    });
  
    return (
      <View style={styles.container}>
            <View style = {{position: 'absolute', top: "3%", left: '2%'}}>
                <Icon
                    icon = {animationActive ? "play" : "pause"}
                    size = {30}
                    color = {ColorsGray.gray400}
                    onPress={() => setAnimationActive(!animationActive)}
                />
            </View>
            <LinearGradient 
                    style = {[styles.textBox,]}
                    colors={[ColorsBlue.blue1300, ColorsBlue.blue1000]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                <Animated.Text style={[styles.text, { opacity: opacityI }]}>I = U / R</Animated.Text>
            </LinearGradient>

            <LinearGradient 
                    style = {[styles.textBox,]}
                    colors={[ColorsBlue.blue1300, ColorsBlue.blue1000]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
            >
                <Animated.Text style={[styles.text, { opacity: opacityV }]}>U = I · R</Animated.Text>
            </LinearGradient>
            
            <LinearGradient 
                    style = {[styles.textBox,]}
                    colors={[ColorsBlue.blue1300, ColorsBlue.blue1000]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                <Animated.Text style={[styles.text, { opacity: opacityR }]}>R = U / I</Animated.Text>
            </LinearGradient>
      </View>
    );
};

export default ExplanationAnimation

const styles = StyleSheet.create({
    imageContainer: {
        height: 221,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: ColorsGray.gray900,//ColorsBlue.blue1200,
        shadowOffset: {height: 1, width: 0},
        shadowRadius: 1,
        shadowOpacity: 1,
        elevation: 4,
    },
    container: {
        height: 221,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 30,
        fontWeight: 'bold',
        color: ColorsBlue.blue50,
        marginVertical: 10,
        padding: 0
    },
    textBox: {
        paddingHorizontal: 35,
        borderColor: ColorsBlue.blue900,
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 5,
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
    }
})