import { ImageBackground, StyleSheet, View, Text } from "react-native"
import Icon from "../../Icon"
import { ColorsBlue } from "../../../constants/palet"
import { LinearGradient } from "expo-linear-gradient"
import GraphDisplay from "./graphDisplay"
import OptionsBar from "./optionsBar"
import ChartDisplay from "./chartDisplay"
import ControlPad from "./ControlPad"
import { useContext } from "react"
import { SocketContext } from "../../../store/socket-context"
import WaitingForMeasurementContainer from "./WaitingForMeasurementContainer"
import PowerOffContianer from "./PowerOffContainer"
import { ChartContext } from "../../../store/chart-context"


function DriveLayout({moveHandler, powerHandler, disconnectHandle}) {
    const socketCtx = useContext(SocketContext)
    const chartCtx = useContext(ChartContext)

    console.log(`chart data length ${chartCtx.chartData.distance.length}`)
    return (
        <View style={{backgroundColor: ColorsBlue.blue1100, flex: 1}}>
        <ImageBackground
            source={require('./../../../../assets/grid.jpg')} 
            style= {styles.background}
            imageStyle={{opacity: 0.4}}
            >
                <OptionsBar
                    disconnectHandle = {disconnectHandle}
                    powerHandler = {powerHandler}
                    moveHandler = {moveHandler}
                />
                {socketCtx.power ? (
                    //Display charts if first data is send, otherwise loading screen
                    socketCtx.isMeasurementStarted && 
                    chartCtx.chartData.distance.length !== 0 ? (
                            <ChartDisplay />
                    ) : (
                        <WaitingForMeasurementContainer />
                    )
                
                ) : (
                    <PowerOffContianer />
                )}

                <ControlPad 
                moveHandler={moveHandler}/>
        </ImageBackground>
    </View>
   
    )
}

export default DriveLayout


const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
})