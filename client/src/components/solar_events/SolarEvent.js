import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Animated, Easing, StyleSheet, ImageBackground, Text, Alert, Dimensions} from 'react-native';
import { ColorsBlue, ColorsGreen, ColorsOrange } from '../../constants/palet';
import SolarModal from './SolarModal';
import ButtonList from '../UI/ButtonList.UI';

const { width, height } = Dimensions.get('window');
function SolarEvent({ isFocused , prevSlideHandler, }) {
    const fadeAnim = new Animated.Value(1);
    
    const [modalVisible, setModalVisible] = useState(true);
    const [completedEvents, setCompletedEvents] = useState(0);
    const [gameTime, setGameTime] = useState(0.0);
    const [score, setScore] = useState(0);
    const [countDown, setCountDown] = useState(0);
    const [gameCountDown, setGameCountDown] = useState('');
    const [solarStorm, setSolarStorm] = useState(false);
    
    const activeEvents = useRef(0);
    const timerRef = useRef(null);
    const animationRef = useRef(null);
    const opacityImage = useRef(0);
    const gameStarted = useRef(false);
    const triggerSolarStorm = useRef(false);

    const images = [
        require('./../../../assets/solar_storm/solarstorm5.png'),
        require('./../../../assets/solar_storm/solarstorm4.png'),
    ];
    
    
    const addStyle = {
        marginBottom: 20,
    };
    
    useEffect(() => {
        if (countDown > 0) {
            const countDownTimer = setTimeout(() => {
                setCountDown((countDown - 0.1).toFixed(1));
                setScore(prevScore => parseFloat((prevScore + 0.1).toFixed(1)));
            }, 100);
            
            return () => clearTimeout(countDownTimer);
        }
    }, [countDown]);
    
    
    useEffect(() => {
        if (gameCountDown > 0) {
            setTimeout(() => {
                setGameCountDown(gameCountDown - 1);
            }, 1000);
        }
    }, [gameCountDown]);
    
    useEffect(() => {
        if (gameCountDown === 0 ) {
            gameStarted.current = true;
            setScore(0);
            setGameTime(0);
            switchImage(true); // Updated
            gameLoop();
        }
    }, [gameCountDown]);

    const logFadeAnimValue = () => {
        fadeAnim.addListener(({ value }) => {
            if (value < 0.5) {
                opacityImage.current = value * 1.5;
            }
            else {
                opacityImage.current = (1 - value) * 1.5
            }
        });
    };

    const switchImage = (continueAnimation) => {
        fadeAnim.setValue(0);
        logFadeAnimValue()
        animationRef.current = Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 10000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start(() => {
            if (gameStarted.current && continueAnimation) {
                switchImage(true);
            }
        });
    };
    
    const resetAnimation = () => {
        if (animationRef.current) {
            animationRef.current.stop();
            fadeAnim.setValue(0);
        }
    };
    


    const startGame = () => {
        triggerSolarStorm.current = false;
        setGameCountDown(3);
    };
    
    const stopGame = () => {
        gameStarted.current = false;
        triggerSolarStorm.current = false;
        setGameCountDown('');
        setCountDown(0.0)
        setScore(0)
        opacityImage.current = 0;
        activeEvents.current = '';
        clearTimeout(timerRef.current);
        resetAnimation();
    };

    const activateEvent = () => {
        if (countDown > 0) {
            activeEvents.current = activeEvents.current - 1;
        }
    };


    const gameLoop = () => {
        console.log('console.log', triggerSolarStorm.current)

        if (!gameStarted.current && countDown > 0) {

            setTimeout(() => gameLoop(), 100);
            return;
        }
        
        if (!triggerSolarStorm.current) {
            triggerSolarStorm.current = Math.random() < 0.08;
    
            if (triggerSolarStorm.current) {
                
                const nextEventIn = Math.random() * 3 + 1;
                const newActiveEvents = Math.floor((Math.random() * 3) * Math.round(nextEventIn)) + 1;
                activeEvents.current = newActiveEvents;

                console.log('newActiveEvents', newActiveEvents)

                setCompletedEvents(0);
                setSolarStorm(true);
                setCountDown(nextEventIn.toFixed(1));
    
                setTimeout(() => {
                    setSolarStorm(false);
                    setCompletedEvents(prevCompletedEvents => prevCompletedEvents + 1);

                    setGameTime(prevGameTime => prevGameTime + 1);
    
                    if (completedEvents < activeEvents.current || activeEvents.current < 0) {
                        gameStarted.current = false;
                        setGameCountDown('');
                        setScore(0);
                        opacityImage.current = 0;
                        activeEvents.current = '';
                        Alert.alert('Niet genoeg events voltooid');
                        //add that socket sends command to wheels to stop. 
                        return;
                    } else {
                        // Wait for 5 seconds before allowing another solar storm
                        setTimeout(() => {
                            if (gameStarted.current) { 
                                triggerSolarStorm.current = false;
                                gameLoop();
                            }
                        }, 5000);
                    }
                }, 1000 * nextEventIn.toFixed(1) + 600 * nextEventIn.toFixed(1) / 2.6);
            } 
            else {
                if (gameStarted.current) { 
                    setTimeout(gameLoop, 100);
                }
            }
        } 
        else {
            if (gameStarted.current) { 
                setTimeout(gameLoop, 100);
            }
        }
    };


    return (
        <View style={styles.container}>
            <ImageBackground
                source={images[1]}
                style={[styles.image, { opacity: 1 }]}
            />
            <Animated.Image
                source={images[0]}
                style={[styles.image, { opacity: gameStarted.current ? opacityImage.current : 0} ]}
            />
             {gameCountDown > 0 && (
                <View style={styles.countdownContainer}>
                    <Text style={styles.countdown}>{gameCountDown}</Text>
                </View>
            )}

            {solarStorm && activeEvents.current !== 0 &&  (
                <View style={styles.solarStormContainer}>
                    <Text style={styles.solarStormText}>Solar Storm!</Text>
                </View>
            )}

            {solarStorm && activeEvents.current === 0 && (
                <View style={styles.solarStormContainer}>
                    <Text style={[styles.solarStormText, {color: ColorsGreen.green300}]}>Solar Storm Voorkomen!</Text>
                </View>
            )}

            <View style={{ flexDirection: 'row' }}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Tijd: {countDown}</Text>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Score: {score}</Text>
                </View>
            </View>

            <SolarModal showModal={modalVisible} setModal={setModalVisible} />

            <View style={styles.numberContainer}>
                <Text style={styles.number}>{activeEvents.current}</Text>
            </View>

            <ButtonList
                textButtonOne={"Terug"}
                firstButtonHandler={() => prevSlideHandler()}
                textButtonTwo={"Activeer"}
                secondButtonHandler={() => activateEvent()}
                textButtonThree={gameCountDown === '' ? "Start" : "Stop"}
                thirdButtonHandler={gameCountDown === ''? () => startGame() : () => stopGame()}
                addStyle={addStyle}
            />
        </View>
    );
}

export default SolarEvent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    image: {
        width: width,
        height: '100%',
        resizeMode: 'contain',
    },
    title: {
        fontSize: 28,
        color: ColorsBlue.blue50,
        fontWeight: '300',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 10
    },
    titleContainer: {
        marginTop: 30,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'rgba(20, 20, 30, 0.3)',
        padding: 12,
        borderRadius: 5,
        borderWidth: 1,
        // borderColor: ColorsBlue.blue900,
        marginHorizontal: 15,
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 5,
    },
    numberContainer: {
        position: 'absolute',
        top: '40%'
        
    },
    number: {
        fontSize: 40,
        color: ColorsBlue.blue50,
        fontWeight: '300',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: {width: 1, height: 3},
        textShadowRadius: 2
    },
    countdownContainer: {
        position: 'absolute',
        top: '15%',
        alignSelf: 'center',
        zIndex: 10,
    },
    countdown: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
    },
    solarStormContainer: {
        position: 'absolute',
        top: '20%',
        alignSelf: 'center',
        zIndex: 10,
    },
    solarStormText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'red',
    },
});
