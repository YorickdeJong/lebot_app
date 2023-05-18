import {Ionicons, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons'
import { Pressable, StyleSheet, View, Text, Animated } from 'react-native'


function Icon ({icon, size, color, onPress, addStyle, differentDir, MaterialIconsDir}) {
    return (
    <Pressable
        onPress = {onPress}
        style = {({pressed}) => {
            return [[styles.iconContainer, addStyle], pressed && styles.pressed]
        }}
        >
            <View>
                
                {
                    !MaterialIconsDir ? (   
                        differentDir ? (
                        <MaterialCommunityIcons
                        name = {icon} 
                        color= {color}
                        size = {size} />) : 
                        (
                        <Ionicons
                        name = {icon} 
                        color= {color}
                        size = {size}/>
                        )
                    ) : (
                        console.log('check'),
                        <MaterialIcons 
                        name = {icon} 
                        color= {color}
                        size = {size}
                        />
                    )
                }
            </View>
  
    </Pressable>
    )
}

export default Icon

const styles = StyleSheet.create({

    pressed: {
        opacity: 0.1
    },
})