import { LinearGradient } from "expo-linear-gradient"
import { ImageBackground, StyleSheet, Text, View } from "react-native"
import { ColorsBlue } from "../../../constants/palet"




function PowerOffContianer() {
    return (
        // Display to first press power button
        <LinearGradient 
        colors={[ColorsBlue.blue1300, ColorsBlue.blue1100, ColorsBlue.blue1300]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style = {styles.loadingContainer}>
            <ImageBackground
            source={require('./../../../../assets/chatbackground.png')} 
            style= {{flex: 1}}
            imageStyle={{opacity: 0.18}}
            >
                <View style = {styles.powerOffContianer}>
                    <Text style = {styles.powerOffText}>PRESS THE POWER BUTTON TO START A MEASUREMENT</Text>
                </View>
            </ImageBackground>
        </LinearGradient>
    )
}

export default PowerOffContianer

const styles = StyleSheet.create({
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
        textShadowColor: ColorsBlue.blue500, // set text shadow color
        textShadowOffset: { width: 0, height: 0 }, // set text shadow offset
        textShadowRadius: 10, // set text shadow radius
    },
    loadingContainer: {
        height: 450,
        margin: 2,
        borderRadius: 5,
        borderColor: ColorsBlue.blue700,
        borderWidth: 1,
    },
})