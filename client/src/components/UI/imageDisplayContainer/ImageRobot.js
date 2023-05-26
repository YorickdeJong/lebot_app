

import { StyleSheet, Animated } from 'react-native'
import { ColorsBlue } from '../../../constants/palet';
import { TouchableOpacity } from 'react-native';
import Icon from '../../Icon';




function ImageRobot({setImageCount, imageCount, fadeAnim, upgradedTab, setUpgradedTabHandler}) {
    return (
<>
        { (imageCount === 1 || imageCount === 3  || imageCount === 4 || imageCount === 5 || imageCount === 6 || imageCount === 7) && 
        <>
        {/* Cast button */}
            <Animated.View style = {{opacity: fadeAnim, position: 'absolute', top: '1.1%', left: '5.15%', 
            zIndex: 3, height: '4%', width: '6%', backgroundColor: ColorsBlue.blue1400}}>
                <TouchableOpacity
                    style = {styles.touchableArea}
                    onPress = {() => setImageCount(0)}
                />
            </Animated.View>
            
        {/* Distance Tile */}
        {
            imageCount !== 1 && imageCount !== 3 &&
            <Animated.View style = {[styles.afstand, {opacity: fadeAnim}]}>
                <TouchableOpacity
                    style = {styles.touchableArea}
                    onPress = {() => setImageCount(upgradedTab.afstand ? 3 : 1)}
                />
            </Animated.View>
        }
        {/* Speed Tile */}
            {imageCount !== 4 && imageCount !== 5 &&
            <Animated.View style = {[styles.snelheid, {opacity: fadeAnim}]}>
                <TouchableOpacity
                    style = {styles.touchableArea}
                    onPress = {() => setImageCount(upgradedTab.snelheid ? 5 : 4)}
                />
            </Animated.View>
            }

        {/* Acceleration Tile */}
        {imageCount !== 6 && imageCount !== 7 &&
            <Animated.View style = {[styles.acceleration, {opacity: fadeAnim}]}>
                <TouchableOpacity
                    style = {styles.touchableArea}
                    onPress = {() => setImageCount(upgradedTab.versnelling? 7 : 5)}
                />
            </Animated.View>
        }

        {/* Upgrades */}
            {(imageCount !== 3  && imageCount !== 4 && imageCount !== 7) &&
            <Animated.View style = {[styles.tile, {opacity: fadeAnim}]}>
                <TouchableOpacity
                    style = {styles.touchableArea}
                    onPress = {() => imageCount === 1 ? setImageCount(2) : imageCount === 4 ? (setUpgradedTabHandler('snelheid') , setImageCount(5)) : (setUpgradedTabHandler('acceleration'), setImageCount(7))}
                />
            </Animated.View>
            
            }
        </>
        }
        {/* Navigate back settings and connect */}
        {imageCount === 0 && 
            <Animated.View style = {{backgroundColor: ColorsBlue.blue1100, opacity: fadeAnim, width: '7%', height: '5%', position: 'absolute', top: '35.5%', left: '16.45%', zIndex: 3, borderTopLeftRadius: 10}}>
                    <TouchableOpacity 
                        style = {styles.touchableArea}
                        onPress = {() => {setImageCount(1)}}
                    />
            </Animated.View>
        }
        {imageCount === 1 && 
            <Animated.View style = {{opacity: fadeAnim, position: 'absolute', top: '3.6%', left: '5.55%', zIndex: 3}}>
                    <Icon 
                        size = {36}
                        color = {ColorsBlue.blue1400}
                        onPress = {() => {setImageCount(2)}}
                        icon = 'navigate-before'
                        MaterialIconsDir={true}
                    />
            </Animated.View>
        }
        {imageCount === 2 && 
        <>
            <Animated.View style = {[styles.confirmButtonsLeft, {opacity: fadeAnim}]}>
                <TouchableOpacity
                    style = {styles.touchableArea}
                    onPress = {() => setImageCount(1)}
                />
            </Animated.View>
            <Animated.View style = {[styles.confirmButtonsRight, {opacity: fadeAnim}]}>
                <TouchableOpacity
                    style = {styles.touchableArea}
                    onPress = {() => (setUpgradedTabHandler('afstand'), setImageCount(3))}
                />
            </Animated.View>
        </>
        }
        </>
    )
}


export default ImageRobot




const styles = StyleSheet.create({
    touchableArea: {
        width: '100%',
        height: '100%',
        zIndex: 3,
    },
    tile: {
        position:'absolute', 
        top: '18.7%',
        left: '39.8%', 
        borderColor: 'rgba(77, 77, 77, 1)', 
        borderWidth: 1, 
        height: '19.5%', 
        width: '26%', 
        borderRadius: 20, 
        zIndex: 2,
        backgroundColor: ColorsBlue.blue400
    },
    confirmButtonsLeft: {
        position:'absolute', 
        top: '51.8%',
        left: '15.5%', 
        borderColor: 'rgba(77, 77, 77, 1)', 
        borderWidth: 1, 
        height: '5.7%', 
        width: '34.5%', 
        borderBottomLeftRadius: 13,
        zIndex: 2,
        backgroundColor: ColorsBlue.blue400
    },
    confirmButtonsRight: {
        position:'absolute', 
        top: '51.8%',
        right: '15.5%', 
        borderColor: 'rgba(77, 77, 77, 1)', 
        borderWidth: 1, 
        height: '5.7%', 
        width: '34.5%', 
        borderBottomRightRadius: 13,
        zIndex: 2,
        backgroundColor: ColorsBlue.blue400
    },
    acceleration: {
        position:'absolute', 
        bottom: '9.2%',
        right: '7.5%', 
        borderColor: 'rgba(77, 77, 77, 1)', 
        borderWidth: 1, 
        height: '7%', 
        width: '26.6%', 
        borderRadius: 20,
        zIndex: 2,
        backgroundColor: ColorsBlue.blue400
    },
    snelheid: {
        position:'absolute', 
        bottom: '9.2%',
        right: '36.8%', 
        borderColor: 'rgba(77, 77, 77, 1)', 
        borderWidth: 1, 
        height: '7%', 
        width: '26.6%', 
        borderRadius: 20,
        zIndex: 2,
        backgroundColor: ColorsBlue.blue400
    },
    afstand: {
        position:'absolute', 
        bottom: '9.2%',
        left: '7.3%', 
        borderColor: 'rgba(77, 77, 77, 1)', 
        borderWidth: 1, 
        height: '7%', 
        width: '26.6%', 
        borderRadius: 20,
        zIndex: 2,
        backgroundColor: ColorsBlue.blue400
    }
})