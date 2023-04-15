import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, ScrollView, Dimensions, Animated } from 'react-native';
import { ColorsBlue, ColorsGray } from '../../constants/palet';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
import Icon from '../../components/Icon';
import LandingPageOne from './PageOne';



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
        marginBottom: 8
    },
    topic: {
        fontSize: 11,
        color: ColorsGray.gray500,
        marginLeft: 16,
        marginBottom: 5
    },
    titleContainer: {
        flexDirection: 'row',
        marginBottom: 25,
    },
    backgroundImage: {
        height: Dimensions.get('window').height * 0.905, //0.8925, // Set the height greater than the screen height
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});