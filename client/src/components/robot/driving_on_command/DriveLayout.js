import { ImageBackground, StyleSheet, View, Dimensions } from "react-native"
import { ColorsBlue } from "../../../constants/palet"
import OptionsBar from "./optionsBar"
import ChartDisplay from "./chartDisplay"
import ControlPad from "./ControllPadDisplay/ControlPad"
import React, { useContext, useEffect, useRef } from "react"
import { SocketContext } from "../../../store/socket-context"
import WaitingForMeasurementContainer from "./WaitingForMeasurementContainer"
import PowerOffContianer from "./PowerOffContainer"
import { ChartContext } from "../../../store/chart-context"
import BlurWrapper from "../../UI/BlurViewWrapper"
import { SafeAreaView } from "react-native-safe-area-context"

const { width, height } = Dimensions.get('screen');
function DriveLayout({moveHandler, midIconHandler, displayNumber, subject, assignmentNumber, measurementType}) {
    const socketCtx = useContext(SocketContext)
    const chartCtx = useContext(ChartContext)
    const [beginMeasurement, setBeginMeasurement] = React.useState(false)

    useEffect(() => {
        if (!socketCtx.power) {
            setBeginMeasurement(false)
        }
    }, [socketCtx.power])
    return (
        <View style={styles.container}>
        <ImageBackground
            source={require('./../../../../assets/planets/control_screen9.png')} 
            style= {styles.background}
            imageStyle={{opacity: 0.8}}
            >
            <SafeAreaView style = {{flex: 1}}
            edges={['top']}>
                    <OptionsBar
                        midIconHandler = {midIconHandler}
                        moveHandler = {moveHandler}
                        displayNumber = {displayNumber}
                        subject={subject}
                        assignmentNumber = {assignmentNumber}
                    />
            
                    {socketCtx.power && socketCtx.isConnected ? (
                        //Display charts if first data is send, otherwise loading screen
                        // socketCtx.isMeasurementStarted && 
                        ((beginMeasurement && measurementType === 'free_driving') || 
                        (socketCtx.isMeasurementStarted && measurementType !== 'free_driving')) &&
                        chartCtx.chartData.distance_time[0].length !== undefined ? (
                        <View style={styles.shadowContainer}>
                            <BlurWrapper style = {styles.loadingContainer} intensity={15} tint="dark">
                                <ChartDisplay 
                                chartData = {chartCtx.chartData}
                                chartToggle = {chartCtx.chartToggle}
                                trueCount = {chartCtx.trueCount}
                                displayChart = {390}
                                subject = {subject}
                                />
                            </BlurWrapper>
                        </View>
                        ) : (
                            <WaitingForMeasurementContainer 
                            isMeasurementStarted = {socketCtx.isMeasurementStarted}
                            setBeginMeasurement = {setBeginMeasurement}
                            measurementType = {measurementType}
                            />
                        )
                    ) : (
                        <PowerOffContianer />
                    )}

                    {/* TODO: change controller for windmill, maybe also change background image to be more like a windmill */}
                    <ControlPad 
                    displayNumber = {displayNumber}
                    moveHandler={moveHandler}
                    /> 
            </SafeAreaView>
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
        borderRadius: 20,
    },
    loadingContainer: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
    },
    shadowContainer: {
        margin: 2,
        marginHorizontal: 5,
        borderRadius: 20,
        ...Platform.select({
            ios: {
                shadowOffset: { height: 2, width: 2},
                shadowRadius: 3,
                shadowOpacity: 1,
                shadowColor: ColorsBlue.blue1400,
            },
            android: {

                borderWidth: 1.2
            }
        }),
        //height: height > 750 ? 520 : 400,
        flex: height > 750 ? 4.8 : 4
    },
})