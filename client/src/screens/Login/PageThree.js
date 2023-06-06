
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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
function LandingPageThree() {
    return(
        <ImageBackground
        source={require('./../../../assets/planets/landing_page3.png')}
        style={styles.backgroundImage}
        resizeMode='cover'
        >
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Leer door te doen</Text>
                <Text style={styles.title}>Train je analystische denkvermogen</Text>
                <Text style={styles.title}>Ontdek jouw passie voor wetenschap</Text>
            </View>
        </ImageBackground>

    )
}

export default LandingPageThree;

const styles = StyleSheet.create({
    backgroundImage: {
        // height: screenHeight,
        // width: screenWidth,
        flex: 1,
        justifyContent: 'flex-end',
    },    
    title: {
        fontSize: 20,
        color: ColorsGray.gray300, //ColorsBlue.blue50,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center'
    },
    titleContainer: {
        marginBottom: 40,
    },

})