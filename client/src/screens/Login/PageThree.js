
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


function LandingPageThree() {
    return(
        <ImageBackground
        source={require('./../../../assets/planets/landing_page3.png')}
        style={styles.backgroundImage}
        >
            <View style={styles.titleContainer}>
                <Text style={styles.title}>• Leer door te doen</Text>
                <Text style={styles.title}>• Train je analystische denkvermogen</Text>
                <Text style={styles.title}>• Ontdek jouw passie voor wetenschap</Text>
            </View>
        </ImageBackground>

    )
}

export default LandingPageThree;

const styles = StyleSheet.create({
    backgroundImage: {
        height: Dimensions.get('window').height * 0.905,//0.8925, // Set the height greater than the screen height
        justifyContent: 'flex-end',
    },    
    title: {
        fontSize: 20,
        color: ColorsGray.gray300, //ColorsBlue.blue50,
        fontWeight: '300',
        marginLeft: 20,
        marginBottom: 15
    },
    titleContainer: {
        marginBottom: 60,
    },

})