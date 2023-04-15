import { LinearGradient } from "expo-linear-gradient"
import { ImageBackground, StyleSheet, Text, View } from "react-native"
import { ColorsBlue } from "../../../constants/palet"
import { BlurView } from "expo-blur"




function PowerOffContianer() {
    return (
        <View style={styles.shadowContainer}>
            <BlurView style = {styles.loadingContainer} intensity={5} tint="dark">
                <View style = {styles.powerOffContianer}>
                    <Text style = {styles.powerOffText}>PRESS THE POWER BUTTON TO START A MEASUREMENT</Text>
                </View>
            </BlurView>
        </View>
    )
}

export default PowerOffContianer

const styles = StyleSheet.create({
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
    powerOffContianer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    powerOffText: {
        fontSize: 20,
        color: ColorsBlue.blue200,
        textAlign: 'center',
        textShadowColor: ColorsBlue.blue1300, // set text shadow color
        textShadowOffset: { width: 1, height: 2 }, // set text shadow offset
        textShadowRadius: 4, // set text shadow radius
    },
    loadingContainer: {
        flex: 1,
        borderRadius: 5,
        borderColor: ColorsBlue.blue1400,
        borderWidth: 0.5,
        overflow: 'hidden',
    },
})