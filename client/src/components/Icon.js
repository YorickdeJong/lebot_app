import {Ionicons, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons'
import { Pressable, StyleSheet, View, Text, Animated, Platform } from 'react-native'

function Icon ({icon, size, color, onPress, addStyle, differentDir, MaterialIconsDir, addBorder}) {
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
                        <View>
                            {Platform.OS === 'android' && (
                                <MaterialCommunityIcons 
                                    name = {icon} 
                                    color= {'rgba(0, 0, 0, 0.4)'}
                                    style = {{borderColor: addBorder && 'rgba(77,77,77,0.15)', position: 'absolute', marginTop: size/15, marginLeft: size/15}}
                                    size = {size}/>
                                )
                            }
                            <MaterialCommunityIcons
                            name = {icon} 
                            color= {color}
                            size = {size} /> 
                            
                        </View>
                        ) : 
                        (
                            <View>
                                {Platform.OS === 'android' && (
                                    <Ionicons 
                                        name = {icon} 
                                        color= {'rgba(0, 0, 0, 1)'}
                                        style = {{borderColor: addBorder && 'rgba(77,77,77,0.15)', position: 'absolute', marginTop: size/15, marginLeft: size/15}}
                                        size = {size}/>
                                    )
                                }
                                <Ionicons
                                name = {icon} 
                                color= {color}
                                style = {{borderColor: addBorder && 'rgba(77,77,77,0.15)', borderWidth: addBorder && 1}}
                                size = {size}/>

                            </View>
                        )
                    ) : (
                        <View>
                            {Platform.OS === 'android' && (
                                <MaterialIcons 
                                    name = {icon} 
                                    color= {'rgba(0, 0, 0, 0.4)'}
                                    style = {{borderColor: addBorder && 'rgba(77,77,77,0.15)', position: 'absolute', marginTop: size/15, marginLeft: size/15}}
                                    size = {size}/>
                                )
                            }
                                <MaterialIcons 
                                name = {icon} 
                                color= {color}
                                size = {size}
                                />
                        </View>
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