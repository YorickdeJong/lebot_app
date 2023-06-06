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
import SubjectInformationModal from '../../components/UI/SubjectInformationModal';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

function Subject({ setIndex, title, topics, setShowModal }) {
    function displaModal() {
        switch(title) {
            case "Wiskunde":
                setIndex(0);
                break;
            case "Natuurkunde":
                setIndex(1);
                break;
            case "Coderen":
                setIndex(2);
                break;
            default:
                setIndex(0);
        }
        setShowModal(true);
    }

    return (
        // TODO on press add a modal that explains what the subject is about
        <TouchableOpacity
        onPress = {() => displaModal()}> 
            <Text style={styles.title}>{title}</Text>
            {topics.map((topic, index) => (
                <Text key={index} style={styles.topic}>
                    {topic}
                </Text>
            ))}
        </TouchableOpacity>
    );
}




function LandingPageTwo({}) {
    //Hellingscoëfficiënt, lijnen opstellen, snijpunten `,
    const text = [
        `Lineaire problemen,  \n\nKwadratische functies \n\nPercentages \n\nGoniometrie` ,
        `Snelheid, versnelling \n\nKrachten \n\nEnergie, vermogen \n\nSchakelingen \n\nElektriciteit`,
        `if-else \n\nFuncties \n\nfor-loops`
    ]
    const [blinkOpacity] = useState(new Animated.Value(1));
    const [showModal, setShowModal] = useState(false);
    const [index, setIndex] = useState(0);


    useEffect(() => {
        // changes opacity value to 0 in 500 ms and afterwards to 1 in 500 ms
        const blinkAnimation = Animated.sequence([
            Animated.timing(blinkOpacity, {
                toValue: 0,
                duration: 1500,
                useNativeDriver: true,
            }),
            Animated.timing(blinkOpacity, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            }),
        ]);

        const loopAnimation = Animated.loop(blinkAnimation);
        loopAnimation.start();

        //set time out for the animation to run for 5 seconds
        const timeoutId = setTimeout(() => {
            loopAnimation.stop();
            Animated.timing(blinkOpacity, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            }).start();
        }, 10000);

        return () => {
            clearTimeout(timeoutId);
            loopAnimation.stop();
            blinkOpacity.setValue(1); // reset the Animated.Value
        };
    }, []);



    return (
        <ImageBackground
            source={require('./../../../assets/planets/landing_page2.png')}
            style={styles.backgroundImage}
            resizeMode='cover'
        >
            <Animated.View style={[styles.titleContainer, {opacity: blinkOpacity}]}>
                <Subject
                    title="Wiskunde"
                    topics={[
                        'Lineaire problemen',
                        'Kwadratische functies',
                        'Percentages',
                        'Goniometrie',
                    ]}
                    setIndex={setIndex}
                    setShowModal={setShowModal}
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
                    setIndex={setIndex}
                    setShowModal={setShowModal}
                />
                <Subject
                    title="Coderen"
                    topics={['if-else', 'Functies', 'for-loops']}
                    setIndex={setIndex}
                    setShowModal={setShowModal}
                />
            </Animated.View>
            <SubjectInformationModal 
                showModal={showModal}
                setShowModal={setShowModal}
                text = {text[index]}
            />
        </ImageBackground>
    );
}

export default LandingPageTwo;

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        color: ColorsBlue.blue100,
        marginHorizontal: 14,
    },
    topic: {
        fontSize: 11,
        color: ColorsGray.gray500,
        marginLeft: 16,
        lineHeight: screenHeight > 750 ? 23 : 20,
    },
    titleContainer: {
        flexDirection: 'row',
        marginBottom: screenHeight > 750 ? 20 : 15,
    },
    backgroundImage: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
    },
});