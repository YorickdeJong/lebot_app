import { Dimensions, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ColorsBlue } from "../../../constants/palet";
import LoadingChat from "../../UI/LoadingChat";
import { BlurView } from "expo-blur";
import React, { useEffect } from "react";
import { Text } from "react-native";



const { height } = Dimensions.get('window')
function WaitingForMeasurementContainer({isMeasurementStarted, setBeginMeasurement, measurementType}) {
    const [countDown, setCountDown] = React.useState(3)
    const extraStyles = {        
        textShadowColor: ColorsBlue.blue1400, 
        textShadowOffset: { width: 1, height: 3 },
        textShadowRadius: 3} 

    useEffect(() => {
        if (isMeasurementStarted && measurementType === 'free_driving') {
            console.log('measurement started')
            const interval = setInterval(() => {
                setCountDown(prevCountDown => {
                    if (prevCountDown <= 1) { // Check if countDown is 0 or less
                        clearInterval(interval) // Clear interval if countdown reached 0
                        setBeginMeasurement(true) // Stop the measurement
                        return 0; // Return 0 to prevent countDown from going below 0
                    } else {
                        return prevCountDown - 1 // Decrease the countdown
                    }
                });
            }, 1000) // Removed the array brackets around 1000
            // 
            return () => clearInterval(interval)
        }
        if (isMeasurementStarted && measurementType !== 'free_driving') {
            setBeginMeasurement(true)
        }

    }, [isMeasurementStarted])

    return (
        <View style={styles.shadowContainer}>
            <BlurView style = {styles.loadingContainer} intensity={2} tint="dark">
                {!isMeasurementStarted && 
                <LoadingChat 
                    message = "Meting wordt gestart" 
                    extraStyles = {extraStyles}
                />
                }
                {isMeasurementStarted && measurementType === 'free_driving' &&
                    <View style = {{justifyContent: 'center', flex: 1}}>
                        <Text style = {styles.text}>METING KAN WORDEN GESTART IN {`\n\n`}{countDown}</Text>
                    </View>
                }
            </BlurView>
        </View>
    )
}


export default React.memo(WaitingForMeasurementContainer)

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        margin: 2,
        borderRadius: 20,
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: Platform.OS === 'android' ? 1.2 : 1,
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
        }),
        flex: height > 750 ? 4.8 : 4
    },
    text: {
        color: ColorsBlue.blue100,
        fontSize: 21,
        textAlign: 'center',
        textShadowColor: ColorsBlue.blue1400, 
        textShadowOffset: { width: 1, height: 3 },
        textShadowRadius: 3

    },
    loadingContainer: {
        flex: 1,
        borderRadius: 20,
        borderColor: ColorsBlue.blue1400,
        borderWidth: Platform.OS === 'android' ? 1.2 : 0.5,
        overflow: 'hidden',
    }
})