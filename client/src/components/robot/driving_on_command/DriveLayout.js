import { ImageBackground, StyleSheet, View, Text } from "react-native"
import Icon from "../../Icon"
import { ColorsBlue } from "../../../constants/palet"
import { LinearGradient } from "expo-linear-gradient"
import GraphDisplay from "./graphDisplay"
import OptionsBar from "./optionsBar"
import ChartDisplay from "./chartDisplay"
import ControlPad from "./ControllPadDisplay/ControlPad"
import React, { useContext } from "react"
import { SocketContext } from "../../../store/socket-context"
import WaitingForMeasurementContainer from "./WaitingForMeasurementContainer"
import PowerOffContianer from "./PowerOffContainer"
import { ChartContext } from "../../../store/chart-context"


function DriveLayout({moveHandler, midIconHandler, rightIconHandler, displayNumber}) {
    const socketCtx = useContext(SocketContext)
    const chartCtx = useContext(ChartContext)

    return (
        <View style={styles.container}>
        <ImageBackground
            source={require('./../../../../assets/grid.jpg')} 
            style= {styles.background}
            imageStyle={{opacity: 0.4}}
            >
                <OptionsBar
                    disconnectHandle = {rightIconHandler}
                    midIconHandler = {midIconHandler}
                    moveHandler = {moveHandler}
                    displayNumber = {displayNumber}
                />
                {socketCtx.power ? (
                    //Display charts if first data is send, otherwise loading screen
                    socketCtx.isMeasurementStarted && 
                    chartCtx.chartData.distance.length !== 0 ? (
                        <LinearGradient 
                        colors={[ColorsBlue.blue1300, ColorsBlue.blue1100]} //ColorsBlue.blue1200, ColorsBlue.blue1100]}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style = {styles.loadingContainer}>
                                <ChartDisplay 
                                chartData = {chartCtx.chartData}
                                chartToggle = {chartCtx.chartToggle}
                                trueCount = {chartCtx.trueCount}
                                displayChart = {460}
                                />
                        </LinearGradient>
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
        borderTopColor: ColorsBlue.blue700,
        borderTopWidth: 0.2,
    },
    loadingContainer: {
        height: 460,
        margin: 2,
        borderRadius: 5,
        borderColor: ColorsBlue.blue700,
        borderWidth: 1,
    },
})