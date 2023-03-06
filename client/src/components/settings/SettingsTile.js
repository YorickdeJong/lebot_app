import { Text, Pressable, StyleSheet, View } from "react-native"
import { ColorsBlue, ColorsDarkerBlue, ColorsDarkestBlue, ColorsGreen, ColorsTile } from "../../constants/palet"
import { useContext } from "react"
import { ColorContext } from "../../store/color-context"
import Icon from "../Icon"
import { LinearGradient } from "expo-linear-gradient"


function SettingsTile({type, color, icon,  iconColor, textColor, onPress, differentDir}){
    const colorCtx = useContext(ColorContext)

    let colors = [
        ColorsDarkestBlue.blue700,
        ColorsTile.blue1000, ColorsTile.blue900,
        ColorsTile.blue700, ColorsTile.blue600,
        ColorsTile.blue500, ColorsTile.blue400,
        ColorsTile.blue300, ColorsTile.blue200
    ];

    colors = color ? color : colors
    const locations = colors.map((_, index) => index / (colors.length - 1));
    
    return (
        <Pressable
        onPress = {onPress}
        style = {({pressed}) => {
            return [styles.tile, , 
            pressed && styles.pressed]
        }}>
            <LinearGradient 
             style = {styles.colorGradient}
             colors={colors}
             start={{ x: 0, y: 0 }}
             end={{ x: 1, y: 1 }}
             locations={locations}
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
        shadowColor: ColorsBlue.blue1000,
        shadowOffset: {height: 2, width: 3},
        shadowRadius: 4,
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