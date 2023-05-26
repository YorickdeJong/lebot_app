import { Dimensions, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ColorsBlue } from "../../../constants/palet";
import LoadingChat from "../../UI/LoadingChat";
import { BlurView } from "expo-blur";



const { height } = Dimensions.get('window')
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
        height: height > 750 ? 460 : 370,
    },
    loadingContainer: {
        flex: 1,
        borderRadius: 20,
        borderColor: ColorsBlue.blue1400,
        borderWidth: Platform.OS === 'android' ? 1.2 : 0.5,
        overflow: 'hidden',
    }
})