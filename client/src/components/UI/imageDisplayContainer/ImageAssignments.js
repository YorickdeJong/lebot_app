

import {View, Image, StyleSheet, Animated, Text} from 'react-native'
import { ColorsBlue, ColorsGray } from '../../../constants/palet';
import { TouchableOpacity } from 'react-native';
import Icon from '../../Icon';

function ImageAssignments({imageCount, setImageCount, fadeAnim}) {
    return (
        <>
    
        {/* Beweging Tile */}
            {
                imageCount !== 0 && imageCount <= 2 &&
                <Animated.View style = {[styles.faseOne, {opacity: fadeAnim}]}>
                    <TouchableOpacity
                        style = {styles.touchableArea}
                        onPress = {() => setImageCount(0)}
                    />
                </Animated.View>
            }
    
        {/* Schakelingen Tile */}
            {
                imageCount !== 1 && imageCount <= 2 &&
                <Animated.View style = {[styles.faseTwo, {opacity: fadeAnim}]}>
                    <TouchableOpacity
                        style = {styles.touchableArea}
                        onPress = {() => setImageCount(1)}
                    />
                </Animated.View>
            }
            
        {/* Energie Tile */}
            {
                imageCount !== 2 && imageCount < 2 &&
                <Animated.View style = {[styles.faseThree, {opacity: fadeAnim}]}>
                    <TouchableOpacity
                        style = {styles.touchableArea}
                        onPress = {() => setImageCount(2)}
                    />
                </Animated.View>
            }
        

        {/* Navigate to Section */}
            {(imageCount <= 2) &&
            <>
                <Animated.View style = {[styles.tileLeft, {opacity: fadeAnim}]}>
                    <TouchableOpacity
                        style = {styles.touchableArea}
                        onPress = {() => setImageCount(3)}
                    />
                </Animated.View>

                <Animated.View style = {[styles.tileMiddleLeft, {opacity: fadeAnim}]}>
                    <TouchableOpacity
                        style = {styles.touchableArea}
                        onPress = {() => setImageCount(4)}
                    />
                </Animated.View>

                <Animated.View style = {[styles.tileMiddleRight, {opacity: fadeAnim}]}>
                    <TouchableOpacity
                        style = {styles.touchableArea}
                        onPress = {() => setImageCount(5)}
                    />
                </Animated.View>

                <Animated.View style = {[styles.tileRight, {opacity: fadeAnim}]}>
                    <TouchableOpacity
                        style = {styles.touchableArea}
                        onPress = {() => setImageCount(6)}
                    />
                </Animated.View>                
            </>
            }
            {imageCount > 2 && imageCount < 6 &&
                <Animated.View style = {{opacity: fadeAnim, position: 'absolute', top: '8%', left: '6.8%', 
                zIndex: 3, height: '4%', width: '6%', backgroundColor: ColorsBlue.blue1200}}>
                    <TouchableOpacity
                        style = {styles.touchableArea}
                        onPress = {() => setImageCount(0)}
                    />
                </Animated.View>
            }
            {
                imageCount === 6 && 
                <>
                <Animated.View style = {{opacity: fadeAnim, position: 'absolute', top: '6.95%', left: '2.7%', zIndex: 3}}>
                    <Icon 
                        size = {25}
                        color = {ColorsBlue.blue1400}
                        onPress = {() => {setImageCount(0)}}
                        icon = 'home'
                    />
                </Animated.View>

                <Animated.View style = {{opacity: fadeAnim, position: 'absolute', top: '46%', left: '43.5%', zIndex: 3}}>
                    <Icon 
                        size = {45}
                        color = {'rgba(0, 0, 0, 1)'}
                        onPress = {() => {setImageCount(7)}}
                        icon = 'checkbox-blank-circle'
                        differentDir={true}
                    />
                </Animated.View>
                
                </>
            }

            {
                imageCount === 7 && 
                <>
                    <Animated.View style = {{opacity: fadeAnim, position: 'absolute', top: '8.35%', left: '6.6%', zIndex: 3}}>
                        <Icon 
                            size = {23}
                            color = {ColorsBlue.blue1400}
                            onPress = {() => {setImageCount(6)}}
                            icon = 'planet'
                        />
                    </Animated.View>
                    <Animated.View style = {{opacity: fadeAnim, position: 'absolute', top: '7.9%', left: '16.6%', zIndex: 3}}>
                        <Icon 
                            size = {23}
                            color = {ColorsBlue.blue1400}
                            onPress = {() => {setImageCount(0)}}
                            icon = 'home'
                        />
                    </Animated.View>
                </>
            }
        </>
    )
}

export default ImageAssignments


const styles = StyleSheet.create({
    touchableArea: {
        width: '100%',
        height: '100%',
        zIndex: 3,
    },
    tileLeft: {
        position:'absolute', 
        top: '34.1%',
        left: '1.4%', 
        borderColor: 'rgba(77, 77, 77, 1)', 
        borderWidth: 1, 
        height: '19%', 
        width: '20.5%', 
        borderRadius: 17, 
        zIndex: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.3)'
    },
    tileMiddleLeft: {
        position:'absolute', 
        top: '34.1%',
        left: '24.4%', 
        borderColor: 'rgba(77, 77, 77, 1)', 
        borderWidth: 1, 
        height: '19%', 
        width: '26%', 
        borderRadius: 20, 
        zIndex: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.3)'
    },
    tileMiddleRight: {
        position:'absolute', 
        top: '34.1%',
        right: '21.2%', 
        borderColor: 'rgba(77, 77, 77, 1)', 
        borderWidth: 1, 
        height: '19%', 
        width: '25.5%', 
        borderRadius: 20, 
        zIndex: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.3)'
    },
    tileRight: {
        position:'absolute', 
        top: '34.1%',
        right: '2.5%', 
        borderColor: 'rgba(77, 77, 77, 1)', 
        borderWidth: 1, 
        height: '19%', 
        width: '15.5%', 
        borderRadius: 20, 
        zIndex: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.3)'
    },
    confirmButtonsLeft: {
        position:'absolute', 
        top: '53%',
        left: '15.5%', 
        borderColor: 'rgba(77, 77, 77, 1)', 
        borderWidth: 1, 
        height: '5.5%', 
        width: '34.5%', 
        borderBottomLeftRadius: 20,
        zIndex: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.3)'
    },
    confirmButtonsRight: {
        position:'absolute', 
        top: '53%',
        right: '15.5%', 
        borderColor: 'rgba(77, 77, 77, 1)', 
        borderWidth: 1, 
        height: '5.5%', 
        width: '34.5%', 
        borderBottomRightRadius: 20,
        zIndex: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.3)'
    },
    faseOne: {
        position:'absolute', 
        bottom: '9%',
        left: '7.3%', 
        borderColor: 'rgba(77, 77, 77, 1)', 
        borderWidth: 1, 
        height: '7%', 
        width: '26.6%', 
        borderRadius: 20,
        zIndex: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.3)'
    },
    faseTwo: {
        position:'absolute', 
        bottom: '9%',
        right: '36.8%', 
        borderColor: 'rgba(77, 77, 77, 1)', 
        borderWidth: 1, 
        height: '7%', 
        width: '26.6%', 
        borderRadius: 20,
        zIndex: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.3)'
    },
    faseThree: {
        position:'absolute', 
        bottom: '9%',
        right: '7.3%', 
        borderColor: 'rgba(77, 77, 77, 1)', 
        borderWidth: 1, 
        height: '7%', 
        width: '26.6%', 
        borderRadius: 20,
        zIndex: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.3)'
    },

})