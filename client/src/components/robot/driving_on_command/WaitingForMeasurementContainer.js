import { ImageBackground, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ColorsBlue } from "../../../constants/palet";
import LoadingChat from "../../UI/LoadingChat";
import { BlurView } from "expo-blur";




function WaitingForMeasurementContainer() {
    
    const extraStyles = {        
        textShadowColor: ColorsBlue.blue1400, 
        textShadowOffset: { width: 1, height: 3 },
        textShadowRadius: 3} 

    return (
        <View style={styles.shadowContainer}>
            <BlurView style = {styles.loadingContainer} intensity={2} tint="dark">
                <LoadingChat 
                message = "Measurement will start shortly" 
                extraStyles = {extraStyles}
                />
            </BlurView>
        </View>
    )
}


export default WaitingForMeasurementContainer

const styles = StyleSheet.create({
    loadingContainer: {
        height: 460,
        margin: 2,
        borderRadius: 5,
        borderColor: ColorsBlue.blue700,
        borderWidth: 1,
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
    loadingContainer: {
        flex: 1,
        borderRadius: 5,
        borderColor: ColorsBlue.blue1400,
        borderWidth: 0.5,
        overflow: 'hidden',
    }
})