import { Text, Pressable, StyleSheet, View, Platform, TouchableOpacity } from "react-native"
import { ColorsBlue, ColorsDarkerBlue, ColorsDarkestBlue, ColorsGreen, ColorsTile } from "../../constants/palet"
import { useContext } from "react"
import { ColorContext } from "../../store/color-context"
import Icon from "../Icon"
import { Shadow } from 'react-native-shadow-2'

function SettingsTile({type, index, icon, onPress}){
    const colorCtx = useContext(ColorContext)

    const addStyle = {
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: {height: 2, width: 1},
        shadowRadius: 4,
        shadowOpacity: 1,
        elevation: 4,
        marginRight: 0
    }

    const shadow = {
        shadowColor: 'rgba(0,0,0,0.5)', // I changed the opacity here
        shadowOffset: {height: 2, width: 1},
        shadowRadius: 4,
        shadowOpacity: 1,
        backgroundColor: 'rgba(1,1,1,1)',
        elevation: 10,
        marginBottom: (Platform.OS === 'android' && index === 4) ? 5 : 0
    }

    return (
        <View style = {[ shadow]}>
            <TouchableOpacity
            onPress = {onPress}
            style = {styles.tile}
         >
                <View 
                    style = {[styles.colorGradient, type === 'LogOut']} // && shadow
                    >
                    <View style = {styles.iconContainer}>
                        <Icon 
                        icon = {icon}
                        color = {ColorsBlue.blue100}
                        size = {40}
                        onPress = {onPress}
                        addStyle = {addStyle}
                        differentDir={type === 'Groepen' ? true : false}
                        />  
                    </View>
                    <View style = {styles.textContainer}>
                        <Text style = {[styles.text]}>{type}</Text>
                    </View>

                    <View style = {[styles.iconContainer, {marginLeft: 50}]}>
                        <Icon 
                        icon = "navigate-next"
                        color = {ColorsBlue.blue100}
                        size = {40}
                        onPress = {onPress}
                        addStyle = {addStyle}
                        MaterialIconsDir={true}
                        />  
                    </View>
                </View>
        </TouchableOpacity>
    </View>
    )
}

export default SettingsTile


const styles = StyleSheet.create({
    textContainer: {
        width: 150,
        marginLeft: 25,
        justifyContent: 'center',
    },
    tile: {
        flex: 1,
        height: 110,
        elevation: 8, 
        borderWidth: 0.6,
        borderColor: ColorsBlue.blue1400,
        backgroundColor: ColorsBlue.blue1150,
    },
    pressed: {
        opacity: 0.7
    },
    colorGradient: {
        height: 130,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        backgroundColor: Platform.OS === 'ios' ? 'rgba(2, 2, 30, 1)' : 'rgba(2, 2, 30, 1)',
        zIndex: 1,
        elevation: 4
    },
    text: {
        textAlign: 'center',
        fontSize: 20,
        textShadowColor: ColorsBlue.blue1400, // set text shadow color
        textShadowOffset: { width: 0, height: 3 }, // set text shadow offset
        textShadowRadius: 2, // set text shadow radius
        color: ColorsBlue.blue100
    },
    iconContainer: {
        flex: 1,
        justifyContent: 'center',   
        marginLeft: 30,
    }
})