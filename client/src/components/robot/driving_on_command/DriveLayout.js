import { ImageBackground, StyleSheet, View, Alert } from "react-native"
import Icon from "../../Icon"
import { ColorsBlue } from "../../../constants/palet"
import { LinearGradient } from "expo-linear-gradient"
import GraphDisplay from "./graphDisplay"
import OptionsBar from "./optionsBar"
import ChartDisplay from "./chartDisplay"
import ControlPad from "./ControllPadDisplay/ControlPad"
import React, { useContext, useEffect, useRef } from "react"
import { SocketContext } from "../../../store/socket-context"
import WaitingForMeasurementContainer from "./WaitingForMeasurementContainer"
import PowerOffContianer from "./PowerOffContainer"
import { ChartContext } from "../../../store/chart-context"
import { BlurView } from "expo-blur"
import { useIsFocused } from "@react-navigation/native"
import { BlinkContext } from "../../../store/animation-context"


function DriveLayout({moveHandler, midIconHandler, displayNumber, subject, assignmentNumber}) {
    const socketCtx = useContext(SocketContext)
    const chartCtx = useContext(ChartContext)

    return (
        <View style={styles.container}>
        <ImageBackground
            source={require('./../../../../assets/planets/control_screen9.png')} 
            style= {styles.background}
            imageStyle={{opacity: 0.8}}
            >
                <OptionsBar
                    midIconHandler = {midIconHandler}
                    moveHandler = {moveHandler}
                    displayNumber = {displayNumber}
                    subject={subject}
                    assignmentNumber = {assignmentNumber}
                />
                {socketCtx.power && socketCtx.isConnected ? (
                    //Display charts if first data is send, otherwise loading screen
                    socketCtx.isMeasurementStarted && 
                    chartCtx.chartData.distance_time[0].length !== undefined ? (
                    <View style={styles.shadowContainer}>
                        <BlurView style = {styles.loadingContainer} intensity={15} tint="dark">
                                <ChartDisplay 
                                chartData = {chartCtx.chartData}
                                chartToggle = {chartCtx.chartToggle}
                                trueCount = {chartCtx.trueCount}
                                displayChart = {390}
                                subject = {subject}
                                />
                        </BlurView>
                    </View>
                    ) : (
                        <WaitingForMeasurementContainer />
                    )
                
                ) : (
                    <PowerOffContianer />
                )}

                {/* TODO: change controller for windmill, maybe also change background image to be more like a windmill */}
                <ControlPad 
                displayNumber = {displayNumber}
                moveHandler={moveHandler}/> 
        </ImageBackground>
    </View>
   
    )
}

export default React.memo(DriveLayout)


const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        backgroundColor: ColorsBlue.blue1100, 
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        margin: 2,
        borderRadius: 5,
    },
    loadingContainer: {
        flex: 1,
        borderRadius: 5,
        overflow: 'hidden',
    },
    shadowContainer: {
        margin: 2,
        marginHorizontal: 5,
        borderRadius: 5,
        ...Platform.select({
            ios: {
                shadowOffset: { height: 2, width: 2},
                shadowRadius: 3,
                shadowOpacity: 1,
                shadowColor: ColorsBlue.blue1400,
            },
            android: {
                elevation: 5,
            },
        }),
        height: 460,
    },
})