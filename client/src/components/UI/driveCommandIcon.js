import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import { Pressable, StyleSheet, View, Text } from 'react-native'


function DriveCommandIcon ({icon, size, color, onPressIn, onPressOut, addStyle, differentDir}) {
    return (
    <Pressable
        onPressIn = {onPressIn}
        onPressOut = {onPressOut}
        style = {({pressed}) => {
            return [[styles.iconContainer, addStyle], pressed && styles.pressed]
        }}
        >
            <View>
                {differentDir ? (
                <MaterialCommunityIcons
                name = {icon} 
                color= {color}
                size = {size} />) : 
                (
                <Ionicons
                name = {icon} 
                color= {color}
                size = {size}/>
                )}
            </View>
  
    </Pressable>
    )
}

export default DriveCommandIcon

const styles = StyleSheet.create({
    iconContainer: {
        marginRight: 10,
    },
    pressed: {
        opacity: 0.1
    },
})