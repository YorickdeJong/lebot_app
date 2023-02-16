import {Ionicons} from '@expo/vector-icons'
import { Pressable, StyleSheet, View, Text } from 'react-native'


function Icon ({icon, size, color, onPress, addStyle}) {
    return (
    <Pressable
        onPress = {onPress}
        style = {({pressed}) => {
            return [[styles.iconContainer, addStyle], pressed && styles.pressed]
        }}
        >
            <View>
                <Ionicons 
                name = {icon} 
                color= {color}
                size = {size} />
            </View>
  
    </Pressable>
    )
}

export default Icon

const styles = StyleSheet.create({
    iconContainer: {
        marginRight: 10,
    },
    pressed: {
        opacity: 0.1
    },
})