
import { StyleSheet, View, StatusBar, Alert, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, Animated } from "react-native"
import Icon from "../../Icon";
import ToggleMenu from "../../robot/driving_on_command/ToggleMenu";
import { ColorsBlue, ColorsGray, ColorsLighterGold, ColorsRed, ColorsTile } from "../../../constants/palet";
import { useContext, useEffect, useState, useRef } from "react";
import {  Header } from 'react-navigation-stack';
import { BlurView } from "expo-blur";
import { Colors } from "react-native/Libraries/NewAppScreen";
import BlurWrapper from "../../UI/BlurViewWrapper";
import SwitchScreensQuestions from "./SwitchScreensQuestions";
import { useNavigation } from "@react-navigation/native";




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
    noForwardArrow
}){
    const [isStopActive, setIsStopActive] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [optionsVisible, setOptionsVisible] = useState(false);
    const metingRef = useRef(null);
    const [metingPosition, setMetingPosition] = useState({ x: 0, y: 0 });
    const navigation = useNavigation();

    const toggleModalOpen = () => {
        setIsStopActive(!isStopActive); 
        return;
    };

    const toggleModalClose = () => {
        setIsStopActive(false);
        return;
    };

    useEffect(() => {
        const headerHeight = Header.HEIGHT + StatusBar.currentHeight;
        setHeaderHeight(headerHeight);
    }, []);

    function OptionsBox() {
        return (
            <TouchableWithoutFeedback onPress={() => setOptionsVisible(false)}>
                <View style={styles.modalBackground}>
                    <TouchableWithoutFeedback onPress={() => {}}
                    style = {{flex: 1, borderRadius: 20, overflow: 'hidden'}}>
                        <BlurWrapper
                            intensity={50}
                            tint="dark"
                            style={[
                            styles.optionsBox,
                            { top: metingPosition.y + 5, right: metingPosition.y - 10 },
                            ]}
                            customColor= 'rgba(30, 30, 80, 0.95)'
                        >
                            {Array.from({ length: chartLength }).map((_, i) => (
                                <TouchableOpacity
                                    key={i + 1}
                                    activeOpacity={0.5}
                                    onPress={() => {
                                        onMetingPressed(i); 
                                    }}
                                    style={styles.pressed}
                                >
                                    <Text style={styles.option}>METING {i + 1}</Text>
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
      }

    const toggleOptions = () => {
        if (optionsVisible) {
            setOptionsVisible(false);
        } else {
            measureMetingPosition();
            setOptionsVisible(true);
        }  
    };

    const measureMetingPosition = () => {
        metingRef.current.measureInWindow((x, y, width, height) => {
          setMetingPosition({ x, y: y + height });
        });
    };

    function homeNavigatorHandler(){
        navigation.navigate('Assignments', {screen: 'AssignmentsResults'})
    }

    return(
    
        <View style = {[styles.upperIcons]}>
                
                {text && 
                    <View style = {{position: 'absolute', top: '58%', left: text.left}}>
                        <Text style = {styles.text}>{text.text}</Text>
                    </View>
                }

                <View style = {{position: 'absolute', top: '53%', left: '4.5%'}}>
                    <Icon 
                    size={ 26}
                    icon= { 'planet' }
                    color={ColorsBlue.blue200}
                    onPress={() => setSlideCount(0)}/>
                </View>

                <View style = {{position: 'absolute', top: '58%', left: '15.5%'}}>
                    <Icon 
                        size={ 22}
                        icon= { "home-outline" }
                        color={ColorsBlue.blue200}
                        onPress={() => homeNavigatorHandler()}
                        />
                </View>


                {chartAvailable && performedMeasurement && 
                    <TouchableOpacity onPress={toggleOptions} style = {{position: 'absolute', top: '57%' , left: '39%'}}>
                    

                        <View ref={metingRef} style = {{flexDirection: 'row'}}>
                                <Text  style = {styles.text}>
                                    METING {currentIndex + 1}
                                </Text>
                            <Icon 
                            icon = "menu-down" 
                            size={23}
                            color={ ColorsBlue.blue50 }//ColorsLighterGold.gold400}
                            onPress = {toggleOptions}
                            differentDir={true}
                            />
                        </View>

                    </TouchableOpacity>
                }


                {performedMeasurement ? 
                    ( !chartAvailable &&
                    <Animated.View style = {{opacity: blinkButton ? opacityChange : 1, position: 'absolute', top: '57%', left: '36%'}}>
                            <TouchableOpacity
                            onPress = {() => redirectToMeasurementHandler()}>
                                <Text style = {[styles.text, {color: blinkButton ? 'gold' : ColorsBlue.blue100}]}>Start Meting</Text>
                            </TouchableOpacity>
                    </Animated.View>
                    ):(!text && !chartAvailable &&
                    <Animated.View style = {{opacity: blinkButton ? opacityChange : 1, position: 'absolute', top: '57%', left: '36%'}}>
                                <Text style = {[styles.text, {color: blinkButton ? 'gold' : ColorsBlue.blue100}]}>Geen Meting</Text>
                    </Animated.View>
                    )
                }


                <SwitchScreensQuestions
                addStyle={{position: 'absolute', top: '43%', right: 0, zIndex: 1000}}
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
                <TouchableOpacity onPress={toggleModalOpen} 
                style = {{position: 'absolute', top: '75%', left: '24%'}}>
                        <View style={styles.stopContainer}>
                            <View
                            style={[
                                styles.stopCircle,
                                isStopActive ? styles.stopCircleActive : {},
                            ]}
                            />
                        </View>
                    </TouchableOpacity>

                    <ToggleMenu
                    headerHeight = {headerHeight}
                    isStopActive = {isStopActive}
                    toggleModalClose = {toggleModalClose}
                    subject = {subject}
                    />
                    
                    <View style = {{position: 'absolute', top: '58%', right: '20%'}}>
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
    )
}

export default AssignmentOptionsBar;

const styles = StyleSheet.create({
    upperIcons: {
        minHeight: 60,
        borderRadius: 20,
        shadowColor: `rgba(0, 0, 0, 1)`,
        shadowOffset: { height: 3, width: 1 },
        shadowRadius: 3,
        shadowOpacity: 1,
        backgroundColor: ColorsBlue.blue1390,
        borderColor: `rgba(77, 77, 77, 0.15)`,
        borderWidth: 1,
        marginHorizontal: 8,
        marginTop: 7,
        marginBottom: 7,
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
})