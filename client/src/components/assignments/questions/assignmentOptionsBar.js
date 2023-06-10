
import { StyleSheet, View, StatusBar, Alert, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, Animated, Platform, Dimensions } from "react-native"
import Icon from "../../Icon";
import ToggleMenu from "../../robot/driving_on_command/ToggleMenu";
import { ColorsBlue, ColorsGray, ColorsLighterGold, ColorsOrange, ColorsRed, ColorsTile } from "../../../constants/palet";
import React, { useContext, useEffect, useState, useRef, useMemo, useCallback } from "react";
import BlurWrapper from "../../UI/BlurViewWrapper";
import SwitchScreensQuestions from "./SwitchScreensQuestions";
import { useNavigation } from "@react-navigation/native";
import { ScrollContext } from "../../../store/scroll-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';



const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window')
const widthIphone = 390
const heightIphone = 844
const ratioWidthIphoneScreen = widthIphone / SCREEN_WIDTH
const ratioHeightIphoneScreen = heightIphone / SCREEN_HEIGHT

function AssignmentOptionsBar({
    midIconHandler, 
    chartLength, 
    currentIndex, 
    redirectToMeasurementHandler, 
    onMetingPressed, 
    subject, 
    blinkButton, 
    chartAvailable,
    performedMeasurement,
    opacityChange,
    slideCount,
    nextSlideHandler,
    prevSlideHandler,
    slideCountEnd,
    setSlideCount,
    text,
    slideTotal,
    noForwardArrow,
    currentSlidePosition,
    noPlanet,
    titleOfPage
}){
    const [isStopActive, setIsStopActive] = useState(false);
    const [optionsVisible, setOptionsVisible] = useState(false);
    const metingRef = useRef(null);
    const [metingPosition, setMetingPosition] = useState({ x: 0, y: 0 });
    const navigation = useNavigation();
    const scrollCtx = useContext(ScrollContext)


    const toggleModalOpen = useCallback(() => {
        setIsStopActive(!isStopActive);
        return;
    }, [isStopActive]);

    const toggleModalClose = useCallback(() => {
        setIsStopActive(false);
        return;
    }, []);

    const toggleOptions = useCallback(() => {
        if (optionsVisible) {
            setOptionsVisible(false);
        } else {
            measureMetingPosition();
            setOptionsVisible(true);
        }
    }, [optionsVisible, measureMetingPosition]);

    const measureMetingPosition = useCallback(() => {
        metingRef.current.measureInWindow((x, y, width, height) => {
            setMetingPosition({ x, y: y + height });
        });
    }, []);

    const homeNavigatorHandler = useCallback(() => {
        navigation.navigate('Assignments', {screen: 'AssignmentsResults'});
    }, [navigation]);
    

    let progressBarItems = [];
    for (let i = 1; i <= slideTotal - 1; i++) {
        if (slideTotal === 2){ 
            progressBarItems.push(
                <TouchableOpacity 
                onPress = {() => {}}
                key={i} style={[styles.lightBlue, {borderRadius: 10}]} />
            )
            break; 
        }
        if (i === 1) { // first item
            if (i <= slideCount) {
                progressBarItems.push( 
                    //Make this touchable such that you can navigate to that tile
                    <TouchableOpacity 
                    onPress = {() => scrollCtx.handleProgressBarPress(i, setSlideCount, currentSlidePosition)}
                    key={i} style={[styles.lightBlue, {borderTopLeftRadius: 10, borderBottomLeftRadius: 10}]}  >
                        <Text style = {styles.textBlock}>{i}</Text>
                    </TouchableOpacity>
                );
            }
            else {
                progressBarItems.push(
                    <TouchableOpacity 
                    onPress = {() => scrollCtx.handleProgressBarPress(i, setSlideCount, currentSlidePosition)}
                    key={i} style={[styles.blue, {borderTopLeftRadius: 10, borderBottomLeftRadius: 10}]} >
                        <Text style = {styles.textBlock}>{i}</Text>
                    </TouchableOpacity>
                );
            }
        }
        else if (i === slideTotal - 1) { // last item
            if (i <= slideCount) {
                progressBarItems.push(
                    <TouchableOpacity 
                    onPress = {() => scrollCtx.handleProgressBarPress(i, setSlideCount, currentSlidePosition)}
                    key={i} style={[styles.lightBlue, {borderTopRightRadius: 10, borderBottomRightRadius: 10}]}  >
                        <Text style = {styles.textBlock}>{i}</Text>
                    </TouchableOpacity>
                );
            }
            else {
                progressBarItems.push(
                    <TouchableOpacity 
                    onPress = {() => scrollCtx.handleProgressBarPress(i, setSlideCount, currentSlidePosition)}
                    key={i} style={[styles.blue, {borderTopRightRadius: 10, borderBottomRightRadius: 10}]}  >
                        <Text style = {styles.textBlock}>{i}</Text>
                    </TouchableOpacity>
                );
            }
        }
        else { // middle items
            if (i <= slideCount) {
                progressBarItems.push(<TouchableOpacity 
                onPress = {() => scrollCtx.handleProgressBarPress(i, setSlideCount, currentSlidePosition)}
                key={i} style={styles.lightBlue}  >
                        <Text style = {styles.textBlock}>{i}</Text>
                    </TouchableOpacity>);
            }
            else {
                progressBarItems.push(<TouchableOpacity 
                onPress = {() => scrollCtx.handleProgressBarPress(i, setSlideCount, currentSlidePosition)}
                key={i} style={styles.blue}  >
                        <Text style = {styles.textBlock}>{i}</Text>
                    </TouchableOpacity>);
            }
        }
    }
    

    const OptionsBox = (() => {
        return (
            <TouchableWithoutFeedback onPress={() => setOptionsVisible(false)}>
                <View style={styles.modalBackground}>
                    <TouchableWithoutFeedback onPress={() => {}}>
                        <BlurWrapper
                            intensity={50}
                            tint="dark"
                            style={[
                            styles.optionsBox,
                            // { top: metingPosition.y + 5, right: metingPosition.y - 10 },
                            ]}
                            customColor= 'rgba(30, 30, 80, 0.95)'
                        >
                            {Array.from({ length: chartLength }).map((_, j) => (
                                <TouchableOpacity
                                    key={j + 1}
                                    activeOpacity={0.5}
                                    onPress={() => {
                                        onMetingPressed(j); 
                                    }}
                                    style={styles.pressed}
                                >
                                    <Text style={styles.option}>METING {j + 1}</Text>
                                </TouchableOpacity>
                            ))}
                                <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => redirectToMeasurementHandler(setOptionsVisible)}
                                style={styles.pressed}
                                >
                                    <Text style={[styles.option, { fontSize: 16, fontWeight: "500" }]}>
                                        Start Meting
                                    </Text>
                                </TouchableOpacity>
                                                       
                        </BlurWrapper>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        );
    })

    console.log('chartAvaliable', chartAvailable)
    return(
        <View style = {styles.shadow}>
            <View style = {[styles.upperIcons]}>   
                    <View>
                        {text && 
                            <View style = {{position: 'absolute', top: '58%', left: text.left}}>
                                <Text style = {styles.text}>{text.text}</Text>
                            </View>
                        }
                        {/* Home button */}

                        <View style = {{position: 'absolute', top: 2, left: noPlanet ? '5%' : '15.5%'}}>
                            <Icon 
                                size={ 22}
                                icon= { "home" }
                                color={ColorsBlue.blue400}
                                onPress={() => homeNavigatorHandler()}
                                />
                        </View>

                        {/* Planet button */}
                        {!noPlanet && <View style = {{position: 'absolute', top: '53%', left: '4.5%'}}>
                            <Icon 
                            size={ 26}
                            icon= { 'planet' }
                            color={ColorsBlue.blue400}
                            onPress={() => setSlideCount(0)}/>
                        </View>
                        }

                        {/* Measurement Text */}
                        {chartAvailable && performedMeasurement && 
                            <TouchableOpacity onPress={toggleOptions} style = {{position: 'absolute', top: 1.5 , left: '39%'}}>
                            

                                <View ref={metingRef} style = {{flexDirection: 'row'}}>
                                        <Text  style = {styles.text}>
                                            METING {currentIndex + 1}
                                        </Text>
                                    <Icon 
                                    icon = "menu-down" 
                                    size={23}
                                    color={ ColorsBlue.blue50 }
                                    onPress = {toggleOptions}
                                    differentDir={true}
                                    />
                                </View>

                            </TouchableOpacity>
                        }

                        {/* header name  */}

                        {performedMeasurement ? 
                            ( !chartAvailable &&
                            <Animated.View style = {{opacity: blinkButton ? opacityChange : 1, position: 'absolute', top: '57%', left: '36%'}}>
                                    <TouchableOpacity
                                    onPress = {() => redirectToMeasurementHandler()}>
                                        <Text style = {[styles.text, {color: blinkButton ? 'gold' : ColorsBlue.blue400}]}>Start Meting</Text>
                                    </TouchableOpacity>
                            </Animated.View>
                            ):(!text && !chartAvailable &&
                            <Animated.View style = {{opacity: blinkButton ? opacityChange : 1, position: 'absolute', top: '57%', left: (titleOfPage && titleOfPage.length > 12) ? '34%' :'36%'}}>
                                        <Text style = {[styles.text, {color: blinkButton ? 'gold' : ColorsBlue.blue400}]}>{titleOfPage ? titleOfPage : 'Geen Meting'}</Text>
                            </Animated.View>
                            )
                        }

                        {/* Switch screen arrows */}
                        <SwitchScreensQuestions
                        addStyle={{position: 'absolute', top: -2,  right: 0, zIndex: 1000}}
                            slideCount={slideCount}
                            prevSlideHandler={prevSlideHandler}
                            nextSlideHandler={nextSlideHandler}
                            slideCountEnd={slideCountEnd}
                            noForwardArrow={noForwardArrow}
                        />
                        {/* Options Box */}
                        <Modal
                            transparent={true}
                            visible={optionsVisible}
                            onRequestClose={() => {
                                setOptionsVisible(false);
                            }}
                        >
                            <OptionsBox />
                        </Modal>

                    {chartAvailable && 
                        <>
                        {/* Toggle Container */}
                        <View style = {{position: 'absolute', top: 3, left: '25.5%'}}>
                            {/* <TouchableOpacity onPress={toggleModalOpen} 
                            >
                                    <View style={styles.stopContainer}>
                                        <View
                                        style={[
                                            styles.stopCircle,
                                            isStopActive ? styles.stopCircleActive : {},
                                        ]}
                                        />
                                    </View>
                            </TouchableOpacity> */}
                            <Icon
                                size = { 22}
                                icon = {'settings'}
                                onPress={toggleModalOpen}
                                color = {ColorsBlue.blue600}
                            />

                        </View>

                        {/* Toggle Modal */}
                            <ToggleMenu
                            isStopActive = {isStopActive}
                            toggleModalClose = {toggleModalClose}
                            subject = {subject}
                            />  
                            <View style = {{position: 'absolute', top: 2, right: '20%'}}>
                                <Icon 
                                icon = "trash-can-outline"
                                size={25}
                                color={ColorsRed.red700}
                                onPress = {midIconHandler}
                                differentDir={true}/>
                            </View>
                        </> 
                    }
                </View>
                <View style = {[styles.progressbar, {backgroundColor: Platform.OS === 'android' && 'rgba(0, 0, 0, 0.4)'}]}>
                    {progressBarItems}
                </View>
            </View>
        </View>
    )
}

export default React.memo(AssignmentOptionsBar);

const styles = StyleSheet.create({
    textBlock: {
        textAlign: 'center',
        color: ColorsGray.gray300,
        fontSize: 11
    },
    progressbar: {
        marginHorizontal: 15, 
        borderColor: 'rgba(77, 77, 77, 0.15)',
        borderWidth: 1,
        marginTop: 38,
        height: 20,
        borderRadius: 10,
        flexDirection: 'row',
        shadowColor: `rgba(0, 0, 0, 1)`,
        shadowOffset: { height: 2, width: 1 },
        shadowRadius: 1,
        shadowOpacity: 1,
        paddingRight: 2,
        paddingBottom: 2,
    },
    shadow: {
        height: 88,
        borderRadius: 20,
        shadowColor: `rgba(0, 0, 0, 1)`,
        shadowOffset: { height: 3, width: 1 },
        shadowRadius: 3,
        shadowOpacity: 1,
        backgroundColor: Platform.OS === 'android' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0)',
        marginHorizontal: 8,
        marginTop: 7,
        marginBottom: 7,
        paddingBottom: 3,
        paddingRight: 2,
    },
    upperIcons: {
        height: 85,
        borderRadius: 20,
        backgroundColor: ColorsBlue.blue1390,
        borderColor: `rgba(77, 77, 77, 0.2)`,
        borderWidth: 1,
        paddingVertical: 15,
    },
    stopContainer: {
        width: 30,
        height: 15,
        marginHorizontal: 5,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: ColorsBlue.blue500,
        justifyContent: "center",
    },
    stopCircle: {
        width: 15,
        height: 15,
        borderRadius: 20,
        backgroundColor: ColorsBlue.blue500,
    },
    stopCircleActive: {
        transform: [{ translateX: 15 }],
    },
    text: {
        fontSize: 20,
        color: ColorsBlue.blue200,//ColorsLighterGold.gold400,
        marginRight: 5,
        textAlign: 'center',
    },
    optionsBox: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: 130,
        position: "absolute",
        top: Platform.OS === 'android' ? (SCREEN_HEIGHT > 750 ? hp('13%') : hp('15%')) : hp('16%'),
        zIndex: 1000, // Make sure the box appears above other elements
        padding: 1.6,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,    
        overflow: 'hidden'
    },
    option: {
        fontSize: 16,
        color: ColorsBlue.blue200,
        marginBottom: 8,
        textAlign: 'center',
    },  
    pressed: {
        width: 128,
        justifyContent: 'center',
        alignItems: 'center',
        height: 26
    },
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        overflow: 'hidden'
    },    
    lightBlue: {
        flex: 1,
        backgroundColor: ColorsBlue.blue600,
        borderColor: 'black',
        borderWidth: 1,
        justifyContent: 'center',
      },
    blue: {
        flex: 1,
        backgroundColor: ColorsBlue.blue1100,
        borderColor: 'black',
        borderWidth: 1,
        justifyContent: 'center',
      },
})