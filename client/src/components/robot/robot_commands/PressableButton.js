import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ColorsBlue } from "../../../constants/palet";



function PressableButton({text, onPress, extraStyles}){
    return(
        <Pressable
        style = {({pressed}) => [[styles.button, extraStyles && {marginHorizontal: extraStyles.marginHorizontal, marginVertical: extraStyles.marginVertical, width: extraStyles.width}], pressed && styles.pressed]}
        onPress = {onPress}>
            <LinearGradient
            style = {styles.colorGradient}
            colors={[ColorsBlue.blue1200, ColorsBlue.blue1000]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
                <Text style = {styles.title}>{text}</Text>
            </LinearGradient>
        </Pressable> 
    )
}

export default PressableButton;


const styles = StyleSheet.create({
    title: {
        color: ColorsBlue.blue200,
        fontSize: 26,
        textAlign: 'center',
    },
    button: {
        margin: 15,
        height: 60,
        marginHorizontal: 25,
        borderRadius: 6,
        borderColor: ColorsBlue.blue700,
        borderWidth: 1,
        elevation: 4, 
        shadowColor: ColorsBlue.blue900,
        shadowOffset: {height: 1, width: 0},
        shadowRadius: 2,
        shadowOpacity: 0.5,
    },
    colorGradient: {
        borderRadius: 6, 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pressed: {
        opacity: 0.5
    },
})