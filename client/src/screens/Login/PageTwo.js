import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, ScrollView, Dimensions, Animated } from 'react-native';
import { ColorsBlue, ColorsGray } from '../../constants/palet';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
import Icon from '../../components/Icon';
import LandingPageOne from './PageOne';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
function Subject({ title, topics }) {
    return (
        // TODO on press add a modal that explains what the subject is about
        <TouchableOpacity> 
            <Text style={styles.title}>{title}</Text>
            {topics.map((topic, index) => (
                <Text key={index} style={styles.topic}>
                    {topic}
                </Text>
            ))}
        </TouchableOpacity>
    );
}

function LandingPageTwo() {
    return (
        <ImageBackground
            source={require('./../../../assets/planets/landing_page2.png')}
            style={styles.backgroundImage}
            resizeMode='cover'
        >
            <View style={styles.titleContainer}>
                <Subject
                    title="Wiskunde"
                    topics={[
                        'Lineaire problemen',
                        'Kwadratische functies',
                        'Percentages',
                        'Goniometrie',
                    ]}
                />
                <Subject
                    title="Natuurkunde"
                    topics={[
                        'Snelheid, versnelling',
                        'Krachten',
                        'Energie, vermogen',
                        'Schakelingen',
                        'Elektriciteit',
                    ]}
                />
                <Subject
                    title="Coderen"
                    topics={['if-else', 'Functies', 'for-loops']}
                />
            </View>
        </ImageBackground>
    );
}

export default LandingPageTwo;

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        color: ColorsBlue.blue100,
        marginHorizontal: 14,
        marginBottom: verticalScale(5)
    },
    topic: {
        fontSize: 11,
        color: ColorsGray.gray500,
        marginLeft: 16,
        marginBottom: verticalScale(5)
    },
    titleContainer: {
        flexDirection: 'row',
        marginBottom: verticalScale(20),
    },
    backgroundImage: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        // width: screenWidth,
        // height: screenHeight,
        flex: 1,
    },
});