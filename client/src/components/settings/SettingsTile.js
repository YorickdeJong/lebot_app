import { Text, Pressable, StyleSheet, View } from "react-native"
import { ColorsBlue, ColorsGreen } from "../../constants/palet"
import { useContext } from "react"
import { ColorContext } from "../../store/color-context"
import Icon from "../Icon"
import { LinearGradient } from "expo-linear-gradient"

function SettingsTile({type, color, icon,  iconColor, textColor, onPress}){
    const colorCtx = useContext(ColorContext)

    return (
        <Pressable
        onPress = {onPress}
        style = {({pressed}) => {
            return [styles.tile, , 
            pressed && styles.pressed]
        }}>
            <LinearGradient colors={[ColorsBlue.blue700, ColorsBlue.blue100]} style = {styles.colorGradient}>
            <Text style = {[styles.text, {color: colorCtx.isBlue ? textColor[0] : textColor[1]}]}>{type}</Text>
            <View style = {styles.iconContainer}>
                <Icon 
                icon = {icon}
                color = {colorCtx.isBlue ? iconColor[0]: iconColor[1]}
                size = {40}
                onPress = {onPress}
                addStyle = {{marginRight: 0}}
                />  
            </View>
            </LinearGradient>
        </Pressable>
    )
}


export default SettingsTile


const styles = StyleSheet.create({
    tile: {
        flex: 1,
        marginTop: 20, 
        margin: 10,
        height: 150,
        borderRadius: 6, 
        elevation: 4, 
        shadowColor: ColorsBlue.blue800,
        shadowOffset: {height: 1, width: 0},
        shadowRadius: 8,
        shadowOpacity: 0.7
    },
    pressed: {
        opacity: 0.7
    },
    colorGradient: {
        borderRadius: 6, 
        flex: 1
    },
    text: {
        textAlign: 'center',
        fontSize: 20,
        marginTop: 20,
        
    },
    iconContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})