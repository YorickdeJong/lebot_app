


import { LinearGradient } from 'expo-linear-gradient'
import { View, TouchableOpacity, StyleSheet, ImageBackground, FlatList, Dimensions, Text, Image } from 'react-native'
import AppExplanationContainer from './AppExplanationContainer'
import { useEffect, useRef, useState } from 'react';
import { ColorsBlue, ColorsGray } from '../../../constants/palet';
import { TextBubbleLeft, TextBubbleRight } from '../../../components/UI/TextBubble';


const { width: SCREEN_WIDTH } = Dimensions.get('window');


function AppExplanation() {
    const [typing, setTyping] = useState(true);
    const flatListRef = useRef(1);
    const [isScrolling, setIsScrolling] = useState(false);
    const [slideCount, setSlideCount] = useState(1);
    const scrollPositionRef = useRef(0);
    const [explanationState, setExplanationState] = useState({
        screenOne: [false, false],
        screenTwo: [false, false],
        screenThree: [false, false],
    });

    useEffect(() => {
        if (!isScrolling) {
          const slide = Math.round(scrollPositionRef.current / SCREEN_WIDTH);
          
        }
      }, [isScrolling, slideCount]);
      
    
    const message = [
        { 
            answer: `Welkom! Ik zie dat dit jou eerste keer is in de app. Daarom zal ik je een rondleiding geven! \n\nOp het volgende scherm zal je afbeeldingen zien van de app, die jou een overview geven. Let goed op, dit geeft je een voorsprong op de rest.`,
            thread_id: 15 
        }, 
    ]


    const SCREENS = [{
        component: AppExplanationContainer,
        props: {
            image: [require('./../../../../assets/carAnimation/roverAnimation.png')], 
            message: message[0],
            currentIndex: 0
        }
    },
    {
        component: AppExplanationContainer,
        props: {
            image: [require('./../../../../assets/instructions/assignments/assignment_screen.png'), require('./../../../../assets/instructions/assignments/schakelingen.png'),
            require('./../../../../assets/instructions/assignments/energy.png'), require('./../../../../assets/instructions/assignments/build_screen.png'),
            require('./../../../../assets/instructions/assignments/coding_theory.png'), require('./../../../../assets/instructions/assignments/coding_question.png'),
            require('./../../../../assets/instructions/assignments/planets.png'), require('./../../../../assets/instructions/assignments/assignments.png')], 
            message: message[1],
            currentIndex: 1
        }
    },
    {
        component: AppExplanationContainer,
        props: {
            image: [require('./../../../../assets/instructions/robot/robot_screen_wifi.png'),
            require('./../../../../assets/instructions/robot/robot_screen_afstand.png'), 
            require('./../../../../assets/instructions/robot/robot_screen_afstand2.png'), require('./../../../../assets/instructions/robot/robot_screen_afstand3.png'),
            require('./../../../../assets/instructions/robot/robot_screen_speed.png'), 
            require('./../../../../assets/instructions/robot/robot_screen_versnelling1.png'), require('./../../../../assets/instructions/robot/robot_screen_versnelling2.png'),
            require('./../../../../assets/instructions/robot/robot_screen_versnelling3.png')
        ], 
            message: message[2],
            currentIndex: 2
        }
    },
    {
        component: AppExplanationContainer,
        props: {
            image: [require('./../../../../assets/instructions/chat/chat_screen.png'), require('./../../../../assets/instructions/chat/chat_screen2.png'),
            require('./../../../../assets/instructions/chat/chat_screen3.png')
        ], 
            message: message[3],
            currentIndex: 3
        }
    }]

    const onScroll = event => {
        scrollPositionRef.current = event.nativeEvent.contentOffset.x;
        const slide = Math.round(scrollPositionRef.current / SCREEN_WIDTH);
        if (slide !== slideCount - 1) {
          setSlideCount(slide + 1);
        }
    };


    const onScrollBeginDrag = () => setIsScrolling(true);
    const onScrollEndDrag = () => setIsScrolling(false);

    const renderItem = ({ item, index }) => {
        const CurrentScreen = item.component;
        return <CurrentScreen {...item.props} index = {slideCount}  setTyping = {setTyping} typing = {typing}/>;
    };

    function setExplanationStateHandler(screen, index) {
        let temp = {...explanationState};
        temp[screen][index] = true;
        setExplanationState(temp);
    }

    return (
        <LinearGradient 
        colors={[ColorsBlue.blueblack1600, ColorsBlue.blueblack1500]}  
        style = {styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        >
            <ImageBackground
            source={require('./../../../../assets/chatbackground.png')} 
            style={
            {flex: 1, paddingTop: 50}
            }
            imageStyle={{opacity: 0.1}}
            >
                {/* Add Project Screen */}
                <FlatList 
                    ref={flatListRef}
                    data={SCREENS}
                    horizontal
                    pagingEnabled
                    removeClippedSubviews
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderItem}
                    keyExtractor={(_, index) => 'screen-' + index}
                    getItemLayout={(data, index) => (
                        { length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index }
                    )}
                    onScroll={event => {
                        // Throttle your scroll event here
                        onScroll(event);
                    }}
                    onScrollBeginDrag={onScrollBeginDrag}
                    onMomentumScrollEnd={event => {
                        onScrollEndDrag(event)
                    }}
                    initialNumToRender={1} // Render 2 items initially
                    maxToRenderPerBatch={1} // Render 2 items in each batch
                    windowSize={1} // Render the visible screen and one offscreen in both directions
                />

                {/* Text */}
                {Math.round(scrollPositionRef.current / SCREEN_WIDTH) === 1 &&
                    <>
                        {!explanationState.screenOne[0] && 
                        <View style = {{position: 'absolute', top: '10%', left: '8%'}}>  
                            <View style = {{ }}>
                                <TextBubbleLeft 
                                title = 'Hier leer je:'
                                text = {`• De test opstelling bouwen (linker tegel) \n• Coderen (middelste tegels) \n• Natuur- en wiskunde (Rechter tegel)`} 
                                setExplanationState = {setExplanationStateHandler.bind(this, 'screenOne', 0)}
                                />
                            </View>
                            <View style = {{position: 'absolute', left: '-9%', top: '85%',}}>
                                <Image
                                    style={styles.profilePicture}
                                    source={require("./../../../../assets/robotIcon.png")}
                                    resizeMode="cover"
                                    />
                            </View>
                        </View>
                        }
                        {explanationState.screenOne[0] && !explanationState.screenOne[1] &&
                        <View style = {{position: 'absolute', top: '55.5%', right: '8%'}}>  
                            <View style = {{}}>
                                <TextBubbleRight 
                                title = 'Kies uit verschillende onderwerpen:'
                                text = {`• Beweging (Fase 1): Snelheid & Versnelling\n• Schakelingen (Fase 2): Ohm & Circuits\n• Energie (Fase 3): Krachten & Vermogen `} 
                                setExplanationState = {setExplanationStateHandler.bind(this, 'screenOne', 1)}
                                />
                            </View>
                            <View style = {{ position: 'absolute', right: '-9%', top: '85%',}}>
                                <Image
                                    style={styles.profilePicture}
                                    source={require("./../../../../assets/robotIcon.png")}
                                    resizeMode="cover"
                                    />
                            </View>
                        </View>
                        }
                    </>
                }
                {Math.round(scrollPositionRef.current / SCREEN_WIDTH) === 2 &&
                    <>
                        {!explanationState.screenTwo[0] && 
                        <View style = {{position: 'absolute', top: '45%', left: '8%'}}>  
                            <View style = {{ }}>
                                <TextBubbleLeft 
                                title = 'Upgrade je robot:'
                                text = {`• Verdien geld door opdrachten op te lossen \n• Kies uit verschillende upgrades om jouw robot te verbeteren`} 
                                setExplanationState = {setExplanationStateHandler.bind(this, 'screenTwo', 0)}
                                />
                            </View>
                            <View style = {{position: 'absolute', left: '-9%', top: '85%',}}>
                                <Image
                                    style={styles.profilePicture}
                                    source={require("./../../../../assets/robotIcon.png")}
                                    resizeMode="cover"
                                    />
                            </View>
                        </View>
                        }
                        {explanationState.screenTwo[0] && !explanationState.screenTwo[1] &&
                        <View style = {{position: 'absolute', top: '45%', right: '8%'}}>  
                            <View style = {{}}>
                                <TextBubbleRight 
                                title = 'Verbind je robot met wifi:'
                                text = {`\n• Scroll naar boven en klik links boven in op het 'cast' icoontje om te verbinden\n\n• Zo kan je live data bekijken van de snelheid, versnelling en energie verbruik van de robot`} 
                                setExplanationState = {setExplanationStateHandler.bind(this, 'screenTwo', 1)}
                                />
                            </View>
                            <View style = {{ position: 'absolute', right: '-9%', top: '85%',}}>
                                <Image
                                    style={styles.profilePicture}
                                    source={require("./../../../../assets/robotIcon.png")}
                                    resizeMode="cover"
                                    />
                            </View>
                        </View>
                        }
                    </>
                }

                {Math.round(scrollPositionRef.current / SCREEN_WIDTH) === 3 &&
                    <>
                        {!explanationState.screenThree[0] && 
                        <View style = {{position: 'absolute', top: '45%', left: '8%'}}>  
                            <View style = {{ }}>
                                <TextBubbleLeft 
                                title = 'Stel je vragen hier:'
                                text = {`• Heb je een vraag? ChatGPT helpt je! \n• Let op! Je krijgt niet gelijk antwoord, maar je wordt in de juiste richting gestuurd.`} 
                                setExplanationState = {setExplanationStateHandler.bind(this, 'screenThree', 0)}
                                />
                            </View>
                            <View style = {{position: 'absolute', left: '-9%', top: '85%',}}>
                                <Image
                                    style={styles.profilePicture}
                                    source={require("./../../../../assets/robotIcon.png")}
                                    resizeMode="cover"
                                    />
                            </View>
                        </View>
                        }
                        {explanationState.screenThree[0] && !explanationState.screenThree[1] &&
                        <View style = {{position: 'absolute', top: '35%', right: '7%'}}>  
                            <View style = {{}}>
                                <TextBubbleRight 
                                title = 'Hoe werkt het?'
                                text = {`•Stel je vraag, wacht even en krijg je antwoord\n• Je kan maximaal 5 chats tegelijk hebben\n• Per Fase kan je met je groep maximaal 45 vragen stellen`} 
                                setExplanationState = {setExplanationStateHandler.bind(this, 'screenThree', 1)}
                                />
                            </View>
                            <View style = {{ position: 'absolute', right: '-9%', top: '85%',}}>
                                <Image
                                    style={styles.profilePicture}
                                    source={require("./../../../../assets/robotIcon.png")}
                                    resizeMode="cover"
                                    />
                            </View>
                        </View>
                        }
                    </>
                }

                <View style = {styles.outerContainer}>
                    <View style={styles.circleContainer}>
                        {SCREENS.map((screen, index) => {
                            const color = (slideCount - 1) === index ? 'lightblue' : ColorsBlue.blue1000;
                            return (
                                <View 
                                    key={`circle-${index}`} 
                                    style={[styles.circle, {backgroundColor: color}]}
                                />
                            )
                        })}
                    </View>
                </View>
                {/* Display the group screen here, such that students can join it. */}
                {/* Click on Begin -> go to join group screen */}
            </ImageBackground>
      </LinearGradient>
    )
}

export default AppExplanation


const styles = StyleSheet.create({
    outerContainer: {
        alignSelf: 'center',
        marginTop: 0,
        marginBottom: 16
    },
    container: {
        flex: 1, 
    },
    circleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        width: 15,
        height: 15,
        borderRadius: 10,
        margin: 8,

    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 30,
        zIndex: 3,
    },
    title: {
        fontSize: 18,
        color: ColorsGray.gray300,
        lineHeight: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center'
    },
    text: {
        fontSize: 16,
        color: ColorsGray.gray300,
        lineHeight: 24,
        marginLeft: 5,
        textAlign: 'center'
    },
})