import { Text, Pressable, StyleSheet, View } from "react-native"
import { ColorsBlue, ColorsDarkerBlue, ColorsDarkestBlue, ColorsGreen, ColorsTile } from "../../constants/palet"
import { useContext } from "react"
import { ColorContext } from "../../store/color-context"
import Icon from "../Icon"
import { LinearGradient } from "expo-linear-gradient"


function SettingsTile({type, color, icon,  iconColor, textColor, onPress, differentDir}){
    const colorCtx = useContext(ColorContext)

    return (
        <Pressable
        onPress = {onPress}
        style = {({pressed}) => {
            return [styles.tile, , 
            pressed && styles.pressed]
        }}>
            <LinearGradient 
            style = {styles.colorGradient}
            colors={[ColorsBlue.blue1200, ColorsBlue.blue900]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
             >
            <Text style = {[styles.text, {color: colorCtx.isBlue ? ColorsBlue.blue50 : ColorsBlue.blue50}]}>{type}</Text>
            <View style = {styles.iconContainer}>
                <Icon 
                icon = {icon}
                color = {colorCtx.isBlue ? ColorsBlue.blue50: ColorsBlue.blue50}
                size = {40}
                onPress = {onPress}
                addStyle = {{marginRight: 0}}
                differentDir={differentDir}
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
        height: 130,
        borderRadius: 6, 
        elevation: 4, 
        shadowColor: ColorsBlue.blue900,
        shadowOffset: {height: 1, width: 0},
        shadowRadius: 4,
        shadowOpacity: 0.7,
        borderWidth: 1,
        borderColor: ColorsBlue.blue700,
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