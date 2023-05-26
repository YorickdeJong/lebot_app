import { StyleSheet, View, Animated, StatusBar} from "react-native"
import Icon from "../../Icon"
import { ColorsBlue } from "../../../constants/palet"
import React, { useContext, useEffect, useRef, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import {  Header } from 'react-navigation-stack';
import { BlurView } from 'expo-blur';
import ToggleMenu from "./ToggleMenu";
import { SocketContext } from "../../../store/socket-context";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { BlinkContext } from "../../../store/animation-context";

function OptionsBar({midIconHandler, midIcon, subject, assignmentNumber}) {
    const [isStopActive, setIsStopActive] = useState(false);
    const [hasModalClosed, setHasModalClosed] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const socketCtx = useContext(SocketContext);
    const navigation = useNavigation()
    const blinkCtx = useContext(BlinkContext)
    const isFocused = useIsFocused();
    const opacityInterpolation = useRef(new Animated.Value(1)).current;
    const opacityInterpolationPower = useRef(new Animated.Value(1)).current;
    const [iconButtonPower, setIconButtonPower] = useState("power");


    const toggleModalOpen = () => {
        setIsStopActive(!isStopActive); 
        return;
    };

    const toggleModalClose = () => {
        setIsStopActive(false);
        setHasModalClosed(true);
        return;
    };
    // New color interpolation code to show data button
    useEffect(() => {
        if (assignmentNumber === 2 && subject === 'MOTOR' && isFocused) {
            blinkCtx.setShouldBlinkChartModal(true)
            opacityInterpolation.current = blinkCtx.colorAnimationMeasurement.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [1, 0, 1],
            });
        } 
    }, [isFocused]);

    useEffect(() => {   
        if (assignmentNumber === 2 && subject === 'MOTOR' && !isStopActive && hasModalClosed ) {
            blinkCtx.setShouldBlinkPowerButton(true)
            opacityInterpolationPower.current = blinkCtx.colorAnimationPower.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [1, 0, 1],
            });
        } 
    }, [hasModalClosed])

    useEffect(() => {
        const headerHeight = Header.HEIGHT + StatusBar.currentHeight;
        setHeaderHeight(headerHeight);
    }, []);

    const addStyleIcon = {
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 4,
        shadowOpacity: 1,
        shadowColor: 'black',
        elevation: 4
    }

    return(    
        <View style={styles.shadowContainer}>
            <BlurView style = {styles.upperContainer} intensity={10} tint="dark">
                <View style = {{padding: 10, paddingTop: 16}}>
                    <View style = {styles.upperIcons}>

                        <Icon 
                        icon = {"md-arrow-back-circle"} 
                        size={40}
                        color={ColorsBlue.blue200}
                        onPress = {() => navigation.goBack()}
                        addStyle={addStyleIcon}
                        />
                        
                            <Animated.View style = {{opacity: blinkCtx.shouldBlinkPowerButton ? opacityInterpolationPower.current : 1}}> 
                                <Icon 
                                icon = {midIcon ? midIcon : (socketCtx.power && socketCtx.isConnected ? "pause-circle-outline" : "power")}
                                size={45}
                                color={blinkCtx.shouldBlinkPowerButton ? 'gold' :  ColorsBlue.blue200}
                                onPress = {midIconHandler}
                                differentDir={true}
                                addStyle={addStyleIcon}
                                />
                            </Animated.View>
                    

                        <Animated.View style = {{opacity: blinkCtx.shouldBlinkChartModal ? opacityInterpolation.current : 1}}> 
                            <TouchableOpacity onPress={toggleModalOpen}>
                                <View style={[styles.stopContainer, {borderColor: blinkCtx.shouldBlinkChartModal ? 'gold' :  ColorsBlue.blue200}]}>
                                    <View
                                    style={[
                                        [styles.stopCircle, {backgroundColor: blinkCtx.shouldBlinkChartModal ? 'gold' :  ColorsBlue.blue200}],
                                        isStopActive ? styles.stopCircleActive : {},
                                    ]}
                                    />
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
            </BlurView>
            <ToggleMenu
                headerHeight = {headerHeight}
                isStopActive = {isStopActive}
                toggleModalClose = {toggleModalClose}
                subject = {subject}
                assignmentNumber = {assignmentNumber}
            />
        </View>
    )
}

export default React.memo(OptionsBar)

const styles = StyleSheet.create({
    shadowContainer: {
        margin: 3,
        marginTop: 8,
        marginHorizontal: 5,
        borderRadius: 20,
        ...Platform.select({
            ios: {
                shadowOffset: { height: 2, width: 1 },
                shadowRadius: 3,
                shadowOpacity: 1,
                shadowColor: ColorsBlue.blue1400,
            },
        }),
        flex: 0.7
    },
    upperContainer: {
        borderColor: ColorsBlue.blue1400,
        borderWidth: Platform.OS === 'android' ? 1.2 :0.5,
        borderRadius: 20,
        overflow: 'hidden',
        flex: 1
    },
    upperIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        marginHorizontal: 10,
    },
    stopContainer: {
        width: 50,
        height: 25,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: ColorsBlue.blue200,
        justifyContent: "center",
        alignItems: "flex-start",
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 4,
        shadowOpacity: 1,
        shadowColor: 'black',
        elevation: 4
    },
    stopCircle: {
        width: 23,
        height: 23,
        borderRadius: 20,
        backgroundColor: ColorsBlue.blue200,
    },
    stopCircleActive: {
        transform: [{ translateX: 25 }],
    },

})