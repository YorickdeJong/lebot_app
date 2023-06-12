import { BlurView } from 'expo-blur';
import {View, Text, StyleSheet, TouchableOpacity, Platform, Animated, Dimensions} from 'react-native';
import { ColorsBlue } from '../../constants/palet';
import BlurWrapper from './BlurViewWrapper';
import { useEffect, useRef, useState } from 'react';
import { Colors } from 'react-native/Libraries/NewAppScreen';


const { width, height } = Dimensions.get('window');
function ButtonList({firstButtonHandler, secondButtonHandler, thirdButtonHandler, textButtonOne, textButtonTwo, textButtonThree, addStyle, selectFase}) {
    const fadeAnim = useRef(new Animated.Value(0.4)).current; // Initial value for opacity: 0

    useEffect(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: false,
            }),
            Animated.timing(fadeAnim, {
              toValue: 0.4,
              duration: 2000,
              useNativeDriver: false,
            }),
          ]),
          {
            iterations: -1,
          },
        ).start();
      }, [selectFase]);
    
    const selectedStyle = {
        borderColor: ColorsBlue.blue600,
        borderWidth: 1.5, 
        backgroundColor: ColorsBlue.blue1200,
        opacity: fadeAnim,
    }
    return (
        <View style = {[styles.buttonOuterContainer, addStyle]}>
            <View style={styles.button}>

            <View style = {[styles.shadow, {backgroundColor: (selectFase === 1 || selectFase === 'afstand') ? 'transparent': (Platform.OS === 'android' ? 'rgba(0, 0, 0, 0.6)' : 'transparant')}]}> 
                    <TouchableOpacity 
                    onPress = {firstButtonHandler}>
                        <Animated.View style = {[styles.buttonContainer,  (selectFase === 1 || selectFase === 'afstand') && selectedStyle]}>
                            <BlurWrapper intensity={8} style={{ flex: 1, borderRadius: 20, overflow: 'hidden', justifyContent: 'center' }}>
                                
                                <Text style={styles.buttonText}>{textButtonOne}</Text>
                            </BlurWrapper>
                        </Animated.View>
                    </TouchableOpacity>
                </View>

                <View style = {[styles.shadow, {backgroundColor: (selectFase === 2 || selectFase === 'speed') ? 'transparent': (Platform.OS === 'android' ? 'rgba(0, 0, 0, 0.6)' : 'transparant')}]}> 
                    <TouchableOpacity 
                    onPress = {secondButtonHandler}>
                        <Animated.View style = {[styles.buttonContainer, (selectFase === 2 || selectFase === 'speed') && selectedStyle]}>
                            <BlurWrapper intensity={8} style={{ flex: 1, borderRadius: 20, overflow: 'hidden', justifyContent: 'center' }}>
                                
                                <Text style={styles.buttonText}>{textButtonTwo}</Text>
                            </BlurWrapper>
                        </Animated.View>
                    </TouchableOpacity>
                </View> 

                <View style = {[styles.shadow, {backgroundColor: (selectFase === 3 || selectFase === 'acceleration') ? 'transparent': (Platform.OS === 'android' ? 'rgba(0, 0, 0, 0.6)' : 'transparant')}]}> 
                    <TouchableOpacity 
                    onPress = {thirdButtonHandler}>
                        <Animated.View style = {[styles.buttonContainer, (selectFase === 3 || selectFase === 'acceleration') && selectedStyle]}>
                            <BlurWrapper intensity={8} style={{ flex: 1, borderRadius: 20, overflow: 'hidden', justifyContent: 'center' }}>
                                
                                <Text style={styles.buttonText}>{textButtonThree}</Text>
                            </BlurWrapper>
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}


export default ButtonList

const styles = StyleSheet.create({
    shadow: {
        shadowColor:  'rgba(0, 0, 0, 1)', // Change shadow color to 'black' for better visibility
        shadowOffset: { width: 1, height: 3 }, // Increase the height offset
        shadowOpacity: 1, // Lower the shadow opacity to make it more subtle
        shadowRadius: 4,
        width: 102,
        height: 58,
        paddingBottom:3, 
        borderRadius: 20,
        paddingRight: 2,
    },
    buttonContainer: {
        width: 100,
        height: 55,
        paddingVertical: 0.4,
        borderRadius: 20,
        borderColor: ColorsBlue.blue700,
        borderWidth: 0.6,
        justifyContent: 'center',
        backgroundColor: ColorsBlue.blue1250,
    },
    buttonText: {
        color: ColorsBlue.blue50,
        fontSize: 22,
        textAlign: 'center',
        fontWeight: '400',
    },
    buttonOuterContainer: {
        position: 'absolute',
        bottom: height >  750 ? '0%' : '-1%',
        width: "100%",
        height: 65
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 30,
        marginBottom: 10,
        borderRadius: 20,
    },
})