import { Text, Pressable, StyleSheet, View } from "react-native"
import { ColorsBlue, ColorsDarkerBlue, ColorsDarkestBlue, ColorsGreen, ColorsTile } from "../../constants/palet"
import { useContext } from "react"
import { ColorContext } from "../../store/color-context"
import Icon from "../Icon"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"


function SettingsTile({type, blurFactor, icon,  onPress, differentDir}){
    const colorCtx = useContext(ColorContext)

    const addStyle = {
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: {height: 2, width: 1},
        shadowRadius: 4,
        shadowOpacity: 1,
        marginRight: 0
    }
    return (
        <Pressable
        onPress = {onPress}
        style = {({pressed}) => {
            return [styles.tile, , 
            pressed && styles.pressed]
        }}>
            <BlurView 
            style = {styles.colorGradient}
            tint = 'light'
            intensity = {blurFactor ? blurFactor : 10}
             >
            <Text style = {[styles.text]}>{type}</Text>
            <View style = {styles.iconContainer}>
                <Icon 
                icon = {icon}
                color = {colorCtx.isBlue ? ColorsBlue.blue50: ColorsBlue.blue50}
                size = {40}
                onPress = {onPress}
                addStyle = {addStyle}
                differentDir={differentDir}
                />  
            </View>
            </BlurView>
        </Pressable>
    )
}


export default SettingsTile


const styles = StyleSheet.create({
    tile: {
        flex: 1,
        marginTop: 10, 
        margin: 10,
        height: 130,
        borderRadius: 6, 
        elevation: 4, 
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: {height: 2, width: 1},
        shadowRadius: 4,
        shadowOpacity: 1,
        borderWidth: 0.6,
        borderColor: ColorsBlue.blue1400,

    },
    pressed: {
        opacity: 0.7
    },
    colorGradient: {
        borderRadius: 6, 
        flex: 1,
        overflow: 'hidden'
    },
    text: {
        textAlign: 'center',
        fontSize: 20,
        marginTop: 20,
        textShadowColor: ColorsBlue.blue1400, // set text shadow color
        textShadowOffset: { width: 0, height: 3 }, // set text shadow offset
        textShadowRadius: 2, // set text shadow radius
        color: ColorsBlue.blue50
    },
    iconContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})