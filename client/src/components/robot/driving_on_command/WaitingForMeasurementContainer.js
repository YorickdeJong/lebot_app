import { ImageBackground, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ColorsBlue } from "../../../constants/palet";
import LoadingChat from "../../UI/LoadingChat";




function WaitingForMeasurementContainer() {
    
    const extraStyles = {        
        textShadowColor: ColorsBlue.blue500, 
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10} 
    return (
        <LinearGradient 
            colors={[ColorsBlue.blue1300, ColorsBlue.blue1100]} //ColorsBlue.blue1200, ColorsBlue.blue1100]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style = {styles.loadingContainer}>
            <ImageBackground
            source={require('./../../../../assets/chatbackground.png')} 
            style= {{flex: 1}}
            imageStyle={{opacity: 0.18}}
            >
            <LoadingChat 
            message = "Measurement will start shortly" 
            extraStyles = {extraStyles}
            />
            
            </ImageBackground>
        </LinearGradient>
    )
}


export default WaitingForMeasurementContainer

const styles = StyleSheet.create({
    loadingContainer: {
        height: 450,
        margin: 2,
        borderRadius: 5,
        borderColor: ColorsBlue.blue700,
        borderWidth: 1,
    },
})