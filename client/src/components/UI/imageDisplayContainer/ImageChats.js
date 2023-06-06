

import { StyleSheet, Animated, TouchableOpacity, Text } from 'react-native'
import { ColorsBlue, ColorsGray } from '../../../constants/palet';
import Icon from '../../Icon';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';


function ImageChat({setImageCount, imageCount, fadeAnim}) {
    const navigation = useNavigation()


    function NavigateHandler() {
        if (navigation) {
          navigation.navigate('groups');
        } else {
          console.error('Navigation not initialized');
        }
    }
    
    return (
        <>
        {(imageCount === 0 || imageCount === 2) && 
            <>
            <Animated.View style = {[styles.border, {opacity: fadeAnim}]}>
                <TouchableOpacity
                    style = {styles.touchableArea}
                    onPress = {() => setImageCount(1)}
                />
            </Animated.View>

            {!imageCount === 2 && <Animated.View style = {{opacity: fadeAnim, position: 'absolute', top: '1.1%', left: '5.45%', 
            zIndex: 4, height: '4%', width: '7%', backgroundColor: ColorsBlue.blue1250}}>
                <TouchableOpacity
                    style = {styles.touchableArea}
                    onPress = {() => setImageCount(2)}
                />
            </Animated.View>
            }
            </>
        }
        {imageCount === 1 && 
            <Animated.View style = {{opacity: fadeAnim, position: 'absolute', top: '1.1%', left: '6.45%', 
            zIndex: 3, height: '4%', width: '6%', backgroundColor: ColorsBlue.blue1250}}>
                <TouchableOpacity
                    style = {styles.touchableArea}
                    onPress = {() => setImageCount(0)}
                />
            </Animated.View>
        }
        {imageCount === 1 && 
        <TouchableOpacity 
            onPress = {() => NavigateHandler()}
            style = {{position: 'absolute', bottom: '10.6%', right: '41%', zIndex: 10,}}
            >
                <Animated.View style = {{ opacity:fadeAnim}}>
                    <Text style = {styles.text}>Begin</Text>
                </Animated.View>
        </TouchableOpacity>
        }
    </>
    )
}


export default ImageChat

const styles = StyleSheet.create({
    border: {
        position:'absolute', 
        top: '8.1%', 
        borderColor: 'rgba(77, 77, 77, 1)', 
        borderWidth: 1, 
        height: '17.5%', 
        width: '94%', 
        borderRadius: 20, 
        zIndex: 2,
        left: '2.3%',
        backgroundColor: 'rgv(255, 255, 255, 0.3'
    },
    touchableArea: {
        width: '100%',
        height: '100%',
        zIndex: 3,
    },
    text: {
        color: ColorsGray.gray300,
        fontSize: 22,
        fontWeight: 'bold',
    }
})